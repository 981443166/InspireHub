# ===== 后端：多阶段构建 =====
FROM eclipse-temurin:25-jdk-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
# 使用 Maven wrapper 或手动安装 mvn
RUN apk add --no-cache maven && mvn clean package -DskipTests -q

FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
