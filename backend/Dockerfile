# Etapa de construcción (Build Stage)
# Usa una imagen de Maven con OpenJDK 17 para compilar el proyecto
FROM maven:3.8.5-openjdk-17 AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo pom.xml para descargar las dependencias
COPY pom.xml .

# Descarga las dependencias de Maven
RUN mvn dependency:go-offline

# Copia el resto del código fuente de la aplicación
COPY src ./src

# Compila la aplicación y empaquétala en un JAR, omitiendo los tests
RUN mvn clean install -DskipTests


# Etapa de ejecución (Run Stage)
# Usa una imagen ligera de OpenJDK 17 JRE para ejecutar la aplicación
FROM eclipse-temurin:17-jre-jammy

# Establece el directorio de trabajo
WORKDIR /app

# Copia el JAR compilado desde la etapa de construcción
# La ruta del JAR debe coincidir con el artifactId y version en tu pom.xml
COPY --from=build /app/target/sistema-ferreteria-1.0.0.jar app.jar

# Expone el puerto en el que corre la aplicación Spring Boot
EXPOSE 8080

# Comando para ejecutar la aplicación cuando se inicie el contenedor
ENTRYPOINT ["java", "-jar", "app.jar"]
