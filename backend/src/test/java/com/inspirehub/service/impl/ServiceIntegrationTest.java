package com.inspirehub.service.impl;

import com.inspirehub.common.BusinessException;
import com.inspirehub.common.ErrorCode;
import com.inspirehub.dto.*;
import com.inspirehub.entity.Inspiration;
import com.inspirehub.entity.User;
import com.inspirehub.mapper.InspirationMapper;
import com.inspirehub.mapper.UserMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@Transactional
@TestPropertySource(properties = {
    "spring.cache.type=none",
    "spring.sql.init.mode=always",
    "spring.datasource.url=jdbc:h2:mem:testdb;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE"
})
@DisplayName("UserService & InspirationService 集成测试")
class ServiceIntegrationTest {

    @Autowired UserServiceImpl userService;
    @Autowired InspirationServiceImpl inspirationService;
    @Autowired TagServiceImpl tagService;
    @Autowired PasswordEncoder passwordEncoder;
    @Autowired UserMapper userMapper;
    @Autowired InspirationMapper inspirationMapper;

    private Long userId;

    @BeforeEach
    void setUp() {
        var req = new RegisterRequest();
        req.setUsername("tester"); req.setEmail("t@test.com"); req.setPassword("pass123");
        var resp = userService.register(req);
        userId = resp.getUser().getId();
    }

    // ===== User =====
    @Test @DisplayName("register + login")
    void registerAndLogin() {
        var login = new LoginRequest(); login.setEmail("t@test.com"); login.setPassword("pass123");
        var resp = userService.login(login);
        assertThat(resp.getToken()).isNotBlank();
        assertThat(resp.getUser().getUsername()).isEqualTo("tester");
    }

    @Test @DisplayName("register dup email rejected")
    void dupEmail() {
        var req = new RegisterRequest();
        req.setUsername("t2"); req.setEmail("t@test.com"); req.setPassword("pass123");
        assertThatThrownBy(() -> userService.register(req))
            .isInstanceOf(BusinessException.class);
    }

    @Test @DisplayName("login wrong password")
    void wrongPassword() {
        var login = new LoginRequest(); login.setEmail("t@test.com"); login.setPassword("wrong");
        assertThatThrownBy(() -> userService.login(login)).isInstanceOf(BusinessException.class);
    }

    @Test @DisplayName("get + update profile")
    void profile() {
        var p = userService.getProfile(userId);
        assertThat(p.getUsername()).isEqualTo("tester");

        var upd = new UpdateProfileRequest(); upd.setUsername("newName");
        var updated = userService.updateProfile(userId, upd);
        assertThat(updated.getUsername()).isEqualTo("newName");
    }

    @Test @DisplayName("update password + relogin")
    void updatePassword() {
        var upd = new UpdateProfileRequest(); upd.setPassword("newpwd123");
        userService.updateProfile(userId, upd);

        var login = new LoginRequest(); login.setEmail("t@test.com"); login.setPassword("newpwd123");
        assertThatCode(() -> userService.login(login)).doesNotThrowAnyException();
    }

    @Test @DisplayName("delete account")
    void deleteAccount() {
        userService.deleteAccount(userId, "pass123");
        assertThatThrownBy(() -> userService.getProfile(userId)).isInstanceOf(BusinessException.class);
    }

    // ===== Inspiration =====
    private InspirationCreateRequest buildReq(String title, String type, String content) {
        var req = new InspirationCreateRequest();
        req.setTitle(title); req.setType(type); req.setContent(content);
        req.setDomain(java.util.List.of("dev"));
        req.setTags(java.util.List.of("test", "unit"));
        return req;
    }

    @Test @DisplayName("create + get + update + delete inspiration")
    void crud() {
        // create
        var created = inspirationService.create(userId, buildReq("Unit Test Note", "note", "hello"));
        assertThat(created.getId()).isNotNull();
        assertThat(created.getTitle()).isEqualTo("Unit Test Note");
        assertThat(created.getDomain()).contains("dev");

        // get
        var detail = inspirationService.getById(userId, created.getId());
        assertThat(detail.getContent()).isEqualTo("hello");

        // update
        var upd = new InspirationUpdateRequest(); upd.setTitle("Updated Title");
        var updated = inspirationService.update(userId, created.getId(), upd);
        assertThat(updated.getTitle()).isEqualTo("Updated Title");

        // delete
        inspirationService.delete(userId, created.getId());
        assertThatThrownBy(() -> inspirationService.getById(userId, created.getId()))
            .isInstanceOf(BusinessException.class);
    }

    @Test @DisplayName("list with pagination")
    void listPagination() {
        for (int i = 1; i <= 5; i++)
            inspirationService.create(userId, buildReq("Item " + i, "note", "c" + i));

        var page = inspirationService.list(userId, 1, 3, null, null, null);
        assertThat(page.getTotal()).isEqualTo(5L);
        assertThat(page.getRecords()).hasSize(3);
        assertThat(page.getPages()).isEqualTo(2L);
    }

    @Test @DisplayName("list filter by type")
    void listFilterType() {
        inspirationService.create(userId, buildReq("Code", "code", "x"));
        inspirationService.create(userId, buildReq("Note1", "note", "y"));
        inspirationService.create(userId, buildReq("Note2", "note", "z"));

        var page = inspirationService.list(userId, 1, 20, "code", null, null);
        assertThat(page.getTotal()).isEqualTo(1L);
        assertThat(page.getRecords().get(0).getType()).isEqualTo("code");
    }

    @Test @DisplayName("search by keyword")
    void search() {
        inspirationService.create(userId, buildReq("Docker tips", "code", "docker compose up"));
        inspirationService.create(userId, buildReq("Something else", "note", "no match"));

        var results = inspirationService.search(userId, "docker");
        assertThat(results).hasSize(1);
        assertThat(results.get(0).getTitle()).contains("Docker");
    }

    @Test @DisplayName("data isolation — cannot access others")
    void isolation() {
        var created = inspirationService.create(userId, buildReq("Private", "note", "secret"));

        var otherReq = new RegisterRequest();
        otherReq.setUsername("other"); otherReq.setEmail("other@t.com"); otherReq.setPassword("pass123");
        var otherId = userService.register(otherReq).getUser().getId();

        assertThatThrownBy(() -> inspirationService.getById(otherId, created.getId()))
            .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> inspirationService.update(otherId, created.getId(), new InspirationUpdateRequest()))
            .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> inspirationService.delete(otherId, created.getId()))
            .isInstanceOf(BusinessException.class);
    }

    // ===== Tags =====
    @Test @DisplayName("tags aggregation sorted")
    void tags() {
        var r1 = buildReq("A", "note", "x"); r1.setTags(java.util.List.of("css", "color"));
        var r2 = buildReq("B", "code", "y"); r2.setTags(java.util.List.of("css", "js"));
        var r3 = buildReq("C", "link", "z"); r3.setTags(java.util.List.of("color"));
        inspirationService.create(userId, r1);
        inspirationService.create(userId, r2);
        inspirationService.create(userId, r3);

        var tags = tagService.getUserTags(userId);
        assertThat(tags).hasSize(3);
        assertThat(tags.get(0).getName()).isEqualTo("css");
        assertThat(tags.get(0).getCount()).isEqualTo(2L);
    }
}
