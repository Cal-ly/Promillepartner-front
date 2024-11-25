::: mermaid
classDiagram
    class PromilleCalculator {
        -String gender
        -int age
        -double weight
        -double targetPromille
        -int hours
        -double result
        +calculate(): void
    }

    class RandomCocktail {
        -Cocktail cocktail
        +fetchRandomCocktail(): void
        +ingredients(): List~String~
    }

    class Cocktail {
        -String strDrink
        -String strCategory
        -String strAlcoholic
        -String strGlass
        -String strInstructions
        -String strDrinkThumb
        -List~String~ ingredients
    }

    PromilleCalculator --> Cocktail : calculates
    RandomCocktail --> Cocktail : fetches
:::