SELECT * FROM gyms
WHERE (
  6371 * acos(
    cos(radians($1)) *
    cos(radians(latitude)) *
    cos(radians(longitude) - radians($2)) +
    sin(radians($1)) *
    sin(radians(latitude))
  )
) <= 10