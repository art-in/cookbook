table! {
    recipes (id) {
        id -> Int4,
        name -> Varchar,
        description -> Varchar,
        complexity -> Int2,
        popularity -> Int2,
        has_image -> Bool,
        ingredients -> Jsonb,
        steps -> Jsonb,
    }
}
