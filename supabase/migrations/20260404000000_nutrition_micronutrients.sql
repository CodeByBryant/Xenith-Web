-- Add micronutrient columns to nutrition_logs
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS fiber numeric(6,1);
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS sugar numeric(6,1);
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS sodium numeric(7,1); -- mg
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS cholesterol numeric(6,1); -- mg
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS saturated_fat numeric(6,1);
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS polyunsaturated_fat numeric(6,1);
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS monounsaturated_fat numeric(6,1);
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS trans_fat numeric(6,1);
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS vitamin_a numeric(7,1); -- IU
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS vitamin_c numeric(6,1); -- mg
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS vitamin_d numeric(6,1); -- IU
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS vitamin_e numeric(6,1); -- mg
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS vitamin_k numeric(6,1); -- mcg
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS thiamin numeric(6,2); -- mg
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS riboflavin numeric(6,2); -- mg
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS niacin numeric(6,2); -- mg
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS vitamin_b6 numeric(6,2); -- mg
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS folate numeric(6,1); -- mcg
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS vitamin_b12 numeric(6,2); -- mcg
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS calcium numeric(7,1); -- mg
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS iron numeric(6,2); -- mg
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS magnesium numeric(6,1); -- mg
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS phosphorus numeric(7,1); -- mg
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS potassium numeric(7,1); -- mg
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS zinc numeric(6,2); -- mg
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS selenium numeric(6,1); -- mcg

-- Add serving information columns
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS brand text;
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS serving_size text;
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS serving_unit text;
ALTER TABLE nutrition_logs ADD COLUMN IF NOT EXISTS fdcId integer; -- USDA FoodData Central ID for reference

-- Create index on fdcId for faster lookups
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_fdcid ON nutrition_logs(fdcId);
