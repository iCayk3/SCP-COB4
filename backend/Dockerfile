# syntax=docker/dockerfile:1
FROM maven:3.9.11-eclipse-temurin-26-alpine AS build
WORKDIR /workspace
COPY pom.xml mvnw ./
COPY .mvn .mvn
RUN mvn -B -ntp dependency:go-offline
COPY src src
RUN mvn -B -ntp package -DskipTests

FROM eclipse-temurin:26-jre-alpine
RUN addgroup -S spring && adduser -S spring -G spring
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
USER spring:spring
EXPOSE 8080
ENTRYPOINT ["sh", "/app/docker-entrypoint.sh"]
