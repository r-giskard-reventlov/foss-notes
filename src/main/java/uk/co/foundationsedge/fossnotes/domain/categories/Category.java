package uk.co.foundationsedge.fossnotes.domain.categories;

public class Category {
    private final String name;

    private Category(String name) {
        this.name = name;
    }

    public static Category of(String name) {
        return new Category(name);
    }

    public String getName() {
        return name;
    }
}
