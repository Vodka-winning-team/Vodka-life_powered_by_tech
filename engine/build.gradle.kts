// :engine — pure Kotlin (no Android), so it can be tested without a phone: ./gradlew :engine:test
// Needs C's root build to put the Kotlin Gradle plugin on the classpath, e.g. in the root build.gradle.kts:
//   id("org.jetbrains.kotlin.jvm") version "<same Kotlin version as the app>" apply false
// and in settings.gradle.kts:  include(":engine")
import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    id("org.jetbrains.kotlin.jvm")
}

java {
    sourceCompatibility = JavaVersion.VERSION_11
    targetCompatibility = JavaVersion.VERSION_11
}

kotlin {
    compilerOptions { jvmTarget.set(JvmTarget.JVM_11) }
}

// Try the engine by hand without a phone: ./gradlew -q --console=plain :engine:tryIt
tasks.register<JavaExec>("tryIt") {
    group = "verification"
    description = "Type messages and see what the engine finds (uses the real data files)."
    classpath = sourceSets["test"].runtimeClasspath
    mainClass.set("mu.fraudlens.moris.engine.TryItKt")
    standardInput = System.`in`
    workingDir = projectDir
}

dependencies {
    // Only the JSON parser is used (no @Serializable classes), so no serialization compiler plugin is needed.
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")
    testImplementation("junit:junit:4.13.2")
}
