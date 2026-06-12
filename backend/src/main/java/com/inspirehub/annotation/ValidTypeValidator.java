package com.inspirehub.annotation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Set;

/**
 * ValidType 校验器
 */
public class ValidTypeValidator implements ConstraintValidator<ValidType, String> {

    private static final Set<String> VALID_TYPES = Set.of("link", "image", "code", "note", "html", "css");

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return false;
        }
        return VALID_TYPES.contains(value);
    }
}
