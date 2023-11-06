Mix and Match category view when M&M display mode is set in the admin for a category

- conditions to display the M&M view: 
     1. Mix and Match display mode
     2. values in the mm_related_categories field

Using values from the mm_related_categories category attribute, 
we trigger the categoryList to build a collection of products including:

  - products from all subcategories of the mm_related_categories with a productSize limit -  currently set to 60

  - style filters are subcategories of the mm_related_categories
  - style icons are specified in the category's Mix and Match menu's Style icon field

  - colour filters are created from the color_family_name attributes of the products in the collection
