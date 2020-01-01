package uk.co.foundationsedge.fossnotes.domain.categories;

import java.util.List;

public interface CategoryRepository {

    default List<Category> findAll() {
        return List.of(
            Category.of("Shared"),
            Category.of("Recent"),
            Category.of("Bookmarks")
        );
    }

}
