FROM maven:3.9-eclipse-temurin-21-alpine AS build

WORKDIR /app

COPY . .

RUN ./mvnw clean package -DskipTests 

FROM amazoncorretto:21-alpine

WORKDIR /app

COPY --from=build app/target/backend.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]