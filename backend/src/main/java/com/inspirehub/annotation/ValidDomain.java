package com.inspirehub.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

/**
 * 校验领域: design / dev / product
 */
@Documented
@Constraint(validatedBy = ValidDomainValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidDomain {

    String message() default "领域值必须为 design / dev / product 之一";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
