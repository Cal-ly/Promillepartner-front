:::mermaid

classDiagram
    class User {
        -String name
        -int age
        -double weight
        -String gender
    }

    class Cocktail {
        -String name
        -String category
        -String type
        -String glass
        -String instructions
        -String imageUrl
        -List~String~ ingredients
    }

    class PromilleCalculator {
        -double targetPromille
        -int hours
        -double result
        +calculatePromille(User user): double
    }

    User "1" --> "1" PromilleCalculator : uses
    User "1" --> "0..*" Cocktail : consumes

:::