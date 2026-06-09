package com.inspirehub.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

/**
 * 校验灵感类型: link / image / code / note
 */
@Documented
@Constraint(validatedBy = ValidTypeValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidType {

    String message() default "类型必须为 link / image / code / note 之一";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
