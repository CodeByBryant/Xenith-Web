import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Calculator } from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Gender = "male" | "female" | "other";
type ActivityLevel = "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extremely_active";
type Goal = "lose_weight" | "maintain" | "gain_muscle";

const ACTIVITY_LEVELS: { value: ActivityLevel; label: string; multiplier: number }[] = [
  { value: "sedentary", label: "Sedentary (little/no exercise)", multiplier: 1.2 },
  { value: "lightly_active", label: "Lightly Active (1-3 days/week)", multiplier: 1.375 },
  { value: "moderately_active", label: "Moderately Active (3-5 days/week)", multiplier: 1.55 },
  { value: "very_active", label: "Very Active (6-7 days/week)", multiplier: 1.725 },
  { value: "extremely_active", label: "Extremely Active (athlete)", multiplier: 1.9 },
];

const GOALS: { value: Goal; label: string; calorieAdjust: number }[] = [
  { value: "lose_weight", label: "Lose Weight", calorieAdjust: -500 },
  { value: "maintain", label: "Maintain Weight", calorieAdjust: 0 },
  { value: "gain_muscle", label: "Gain Muscle", calorieAdjust: 300 },
];

function calculateBMR(weight: number, height: number, age: number, gender: Gender): number {
  // Mifflin-St Jeor Equation
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = ACTIVITY_LEVELS.find((a) => a.value === activityLevel)?.multiplier || 1.2;
  return bmr * multiplier;
}

function calculateMacros(calories: number, goal: Goal) {
  let proteinRatio = 0.3;
  let fatRatio = 0.25;
  let carbRatio = 0.45;

  if (goal === "gain_muscle") {
    proteinRatio = 0.35;
    fatRatio = 0.25;
    carbRatio = 0.4;
  } else if (goal === "lose_weight") {
    proteinRatio = 0.35;
    fatRatio = 0.3;
    carbRatio = 0.35;
  }

  return {
    protein: (calories * proteinRatio) / 4, // 4 cal/g
    carbs: (calories * carbRatio) / 4,
    fat: (calories * fatRatio) / 9, // 9 cal/g
  };
}

export default function BiometricWizard() {
  const { profile, updateProfile, isUpdating } = useProfile();
  const [step, setStep] = useState(1);

  // Get user's preferred units (default to metric)
  const preferredUnits = (profile?.preferred_units as "metric" | "imperial") || "metric";
  const isImperial = preferredUnits === "imperial";

  // Conversion helpers
  const cmToFeet = (cm: number) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
  };

  const feetToCm = (feet: number, inches: number) => {
    return (feet * 12 + inches) * 2.54;
  };

  const kgToLbs = (kg: number) => Math.round(kg * 2.20462);
  const lbsToKg = (lbs: number) => lbs / 2.20462;

  // Initialize height and weight from profile
  const initialHeight = profile?.height_cm || 0;
  const initialWeight = profile?.weight_kg || 0;
  const initialHeightFt = initialHeight ? cmToFeet(initialHeight) : { feet: 5, inches: 8 };

  // Form state
  const [age, setAge] = useState(profile?.age?.toString() || "");
  const [gender, setGender] = useState<Gender>(profile?.gender as Gender || "male");
  
  // Height state (store separately for imperial)
  const [heightCm, setHeightCm] = useState(profile?.height_cm?.toString() || "");
  const [heightFeet, setHeightFeet] = useState(initialHeightFt.feet.toString());
  const [heightInches, setHeightInches] = useState(initialHeightFt.inches.toString());
  
  // Weight state
  const [weightKg, setWeightKg] = useState(profile?.weight_kg?.toString() || "");
  const [weightLbs, setWeightLbs] = useState(
    initialWeight ? kgToLbs(initialWeight).toString() : ""
  );
  
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    profile?.activity_level as ActivityLevel || "moderately_active"
  );
  const [goal, setGoal] = useState<Goal>(profile?.goal as Goal || "maintain");

  const canProceed = () => {
    if (step === 1) {
      if (isImperial) {
        return age && gender && heightFeet && heightInches && weightLbs;
      }
      return age && gender && heightCm && weightKg;
    }
    if (step === 2) return activityLevel;
    if (step === 3) return goal;
    return false;
  };

  const handleCalculate = async () => {
    const ageNum = parseInt(age);
    
    // Convert to metric for calculations
    let heightNum: number;
    let weightNum: number;

    if (isImperial) {
      const feet = parseInt(heightFeet) || 0;
      const inches = parseInt(heightInches) || 0;
      heightNum = feetToCm(feet, inches);
      weightNum = lbsToKg(parseFloat(weightLbs) || 0);
    } else {
      heightNum = parseFloat(heightCm);
      weightNum = parseFloat(weightKg);
    }

    if (!ageNum || !heightNum || !weightNum) {
      toast.error("Please fill all fields");
      return;
    }

    const bmr = calculateBMR(weightNum, heightNum, ageNum, gender);
    const tdee = calculateTDEE(bmr, activityLevel);
    const goalAdjust = GOALS.find((g) => g.value === goal)?.calorieAdjust || 0;
    const targetCals = Math.round(tdee + goalAdjust);
    const macros = calculateMacros(targetCals, goal);

    try {
      await updateProfile({
        age: ageNum,
        gender,
        height_cm: heightNum,
        weight_kg: weightNum,
        activity_level: activityLevel,
        goal,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        target_calories: targetCals,
        target_protein: Math.round(macros.protein),
        target_carbs: Math.round(macros.carbs),
        target_fat: Math.round(macros.fat),
      });
      toast.success("Targets calculated and saved!");
      setStep(4);
    } catch {
      toast.error("Failed to save targets");
    }
  };

  const results = profile?.target_calories
    ? {
        bmr: profile.bmr || 0,
        tdee: profile.tdee || 0,
        calories: profile.target_calories,
        protein: profile.target_protein || 0,
        carbs: profile.target_carbs || 0,
        fat: profile.target_fat || 0,
      }
    : null;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
          <Calculator className="w-6 h-6 text-emerald-500" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">Biometric Wizard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Calculate your personalized calorie and macro targets
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all",
              s <= step ? "bg-emerald-500" : "bg-border"
            )}
          />
        ))}
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold text-foreground">Basic Info</h2>

            <div>
              <label className="text-sm text-muted-foreground block mb-2">Age</label>
              <Input
                type="number"
                placeholder="25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min={13}
                max={120}
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground block mb-2">Gender</label>
              <div className="grid grid-cols-3 gap-2">
                {(["male", "female", "other"] as Gender[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={cn(
                      "py-2.5 rounded-xl text-sm font-medium border transition-all capitalize",
                      gender === g
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-muted-foreground hover:border-foreground/30"
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground block mb-2">
                Height {isImperial ? "(ft, in)" : "(cm)"}
              </label>
              {isImperial ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      type="number"
                      placeholder="5"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(e.target.value)}
                      min={3}
                      max={8}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Feet</p>
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="8"
                      value={heightInches}
                      onChange={(e) => setHeightInches(e.target.value)}
                      min={0}
                      max={11}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Inches</p>
                  </div>
                </div>
              ) : (
                <Input
                  type="number"
                  placeholder="170"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  min={100}
                  max={250}
                />
              )}
            </div>

            <div>
              <label className="text-sm text-muted-foreground block mb-2">
                Weight {isImperial ? "(lbs)" : "(kg)"}
              </label>
              {isImperial ? (
                <Input
                  type="number"
                  placeholder="150"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value)}
                  min={66}
                  max={660}
                />
              ) : (
                <Input
                  type="number"
                  placeholder="70"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  min={30}
                  max={300}
                />
              )}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold text-foreground">Activity Level</h2>
            <p className="text-sm text-muted-foreground">
              How active are you on a typical week?
            </p>

            <div className="space-y-2">
              {ACTIVITY_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setActivityLevel(level.value)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl border transition-all",
                    activityLevel === level.value
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "border-border hover:border-foreground/30"
                  )}
                >
                  <p className="text-sm font-medium text-foreground">{level.label}</p>
                  <p className="text-xs text-muted-foreground">
                    Multiplier: {level.multiplier}x
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold text-foreground">Your Goal</h2>
            <p className="text-sm text-muted-foreground">
              What's your primary fitness goal?
            </p>

            <div className="space-y-2">
              {GOALS.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setGoal(g.value)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl border transition-all",
                    goal === g.value
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "border-border hover:border-foreground/30"
                  )}
                >
                  <p className="text-sm font-medium text-foreground">{g.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {g.calorieAdjust > 0
                      ? `+${g.calorieAdjust} calories`
                      : g.calorieAdjust < 0
                      ? `${g.calorieAdjust} calories`
                      : "Maintenance calories"}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 4 && results && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                <Check className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                Your Targets
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                These are now saved to your profile
              </p>
            </div>

            {/* Calorie target */}
            <div className="bg-card border border-border rounded-2xl p-5 text-center">
              <p className="text-sm text-muted-foreground mb-1">Daily Calorie Target</p>
              <p className="text-4xl font-bold text-foreground">
                {results.calories}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                BMR: {results.bmr} kcal · TDEE: {results.tdee} kcal
              </p>
            </div>

            {/* Macros */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Protein</p>
                <p className="text-2xl font-bold text-blue-500">{results.protein}g</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Carbs</p>
                <p className="text-2xl font-bold text-yellow-500">{results.carbs}g</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Fat</p>
                <p className="text-2xl font-bold text-rose-500">{results.fat}g</p>
              </div>
            </div>

            <Button
              onClick={() => setStep(1)}
              variant="outline"
              className="w-full"
            >
              Recalculate
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      {step < 4 && (
        <div className="flex gap-3">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <Button
            onClick={() => {
              if (step === 3) {
                handleCalculate();
              } else {
                setStep(step + 1);
              }
            }}
            disabled={!canProceed() || isUpdating}
            className="flex-1"
          >
            {step === 3 ? (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                {isUpdating ? "Calculating..." : "Calculate"}
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
