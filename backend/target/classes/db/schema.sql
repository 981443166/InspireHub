-- ============================================================
-- InspireHub 数据库初始化脚本
-- 数据库: PostgreSQL 14+
-- 编码: UTF-8
-- ============================================================

-- 清理（仅开发环境使用，生产慎用）
-- DROP TABLE IF EXISTS inspirations CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- ============================================================
-- 1. 用户表 (users)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id              BIGSERIAL       PRIMARY KEY,
    username        VARCHAR(50)     NOT NULL UNIQUE,
    email           VARCHAR(100)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    avatar_url      VARCHAR(500),
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE  users             IS '用户表';
COMMENT ON COLUMN users.id          IS '主键';
COMMENT ON COLUMN users.username    IS '用户名，唯一';
COMMENT ON COLUMN users.email       IS '邮箱，登录凭证，唯一';
COMMENT ON COLUMN users.password_hash IS 'BCrypt 密码哈希';
COMMENT ON COLUMN users.avatar_url  IS '头像 URL（可选）';
COMMENT ON COLUMN users.created_at  IS '注册时间';

-- 索引：邮箱登录查询
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- ============================================================
-- 2. 灵感表 (inspirations)
-- ============================================================
CREATE TABLE IF NOT EXISTS inspirations (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(200)    NOT NULL,
    type            VARCHAR(20)     NOT NULL CHECK (type IN ('link', 'image', 'code', 'note')),
    content         TEXT            NOT NULL,
    domain          TEXT[]          DEFAULT '{}',
    tags            TEXT[]          DEFAULT '{}',
    notes           TEXT,
    language        VARCHAR(30),
    source_url      VARCHAR(500),
    image_thumbnail VARCHAR(500),
    tsv             TSVECTOR,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE  inspirations              IS '灵感表';
COMMENT ON COLUMN inspirations.id           IS '主键';
COMMENT ON COLUMN inspirations.user_id      IS '所属用户 FK → users.id';
COMMENT ON COLUMN inspirations.title        IS '标题，最长 200 字符';
COMMENT ON COLUMN inspirations.type         IS '类型: link / image / code / note';
COMMENT ON COLUMN inspirations.content      IS 'URL / 图片URL / 代码 / 纯文本';
COMMENT ON COLUMN inspirations.domain       IS '领域数组: {design, dev, product}';
COMMENT ON COLUMN inspirations.tags         IS '自定义标签数组';
COMMENT ON COLUMN inspirations.notes        IS 'Markdown 备注';
COMMENT ON COLUMN inspirations.language     IS '代码语言 (code 类型时)';
COMMENT ON COLUMN inspirations.source_url   IS '原始引用链接';
COMMENT ON COLUMN inspirations.image_thumbnail IS '自动生成的缩略图 URL';
COMMENT ON COLUMN inspirations.tsv          IS '全文搜索向量';
COMMENT ON COLUMN inspirations.created_at   IS '创建时间';
COMMENT ON COLUMN inspirations.updated_at   IS '更新时间';

-- 索引：按用户 + 时间排序（列表查询核心）
CREATE INDEX IF NOT EXISTS idx_inspirations_user_created
    ON inspirations (user_id, created_at DESC);

-- 索引：按类型筛选
CREATE INDEX IF NOT EXISTS idx_inspirations_type
    ON inspirations (user_id, type);

-- 索引：领域数组 GIN 索引（筛选加速）
CREATE INDEX IF NOT EXISTS idx_inspirations_domain
    ON inspirations USING GIN (domain);

-- 索引：标签数组 GIN 索引（标签筛选加速）
CREATE INDEX IF NOT EXISTS idx_inspirations_tags
    ON inspirations USING GIN (tags);

-- 索引：全文搜索 GIN 索引
CREATE INDEX IF NOT EXISTS idx_inspirations_tsv
    ON inspirations USING GIN (tsv);

-- ============================================================
-- 3. 全文搜索：自动更新 tsv 向量的触发器
-- ============================================================
CREATE OR REPLACE FUNCTION inspirations_tsv_trigger() RETURNS TRIGGER AS $$
BEGIN
    NEW.tsv :=
        setweight(to_tsvector('simple', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('simple', COALESCE(NEW.notes, '')), 'B') ||
        setweight(to_tsvector('simple', COALESCE(NEW.content, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 每次 INSERT 或 UPDATE title/notes/content 时自动刷新 tsv
DROP TRIGGER IF EXISTS trg_inspirations_tsv ON inspirations;
CREATE TRIGGER trg_inspirations_tsv
    BEFORE INSERT OR UPDATE OF title, notes, content
    ON inspirations
    FOR EACH ROW
    EXECUTE FUNCTION inspirations_tsv_trigger();

-- ============================================================
-- 4. 自动更新 updated_at 的触发器
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_inspirations_updated_at ON inspirations;
CREATE TRIGGER trg_inspirations_updated_at
    BEFORE UPDATE ON inspirations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 5. 创建 inspire_user 数据库用户（如尚未创建）
-- ============================================================
-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'inspire_user') THEN
--         CREATE ROLE inspire_user WITH LOGIN PASSWORD 'inspire_pass';
--     END IF;
-- END $$;
-- GRANT ALL PRIVILEGES ON DATABASE inspirehub TO inspire_user;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO inspire_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO inspire_user;
