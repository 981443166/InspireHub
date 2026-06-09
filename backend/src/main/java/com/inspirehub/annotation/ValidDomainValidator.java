package com.inspirehub.annotation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.List;
import java.util.Set;

/**
 * ValidDomain 校验器
 */
public class ValidDomainValidator implements ConstraintValidator<ValidDomain, List<String>> {

    private static final Set<String> VALID_DOMAINS = Set.of("design", "dev", "product");

    @Override
    public boolean isValid(List<String> values, ConstraintValidatorContext context) {
        if (values == null || values.isEmpty()) {
            return true; // 允许为空
        }
        return VALID_DOMAINS.containsAll(values);
    }
}
