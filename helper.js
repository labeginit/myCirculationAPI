// verifies if the user is logged in
exports.isAuthenticated = function isAuthenticated(request) {
  return (request.session.user == null) ? false : true;
}

// Analysis is based on data from https://pressbooks.library.ryerson.ca/vitalsign/chapter/blood-pressure-ranges/
exports.estimateRisk = function estimateRisk(age, systolic, diastolic) {
  let verdict = 'Your preassure is ubnormal. Try to calm down and test again.';
  if ((2 < age) && (age <= 13)) {
    if (((80 <= systolic) && (systolic <= 120)) && ((40 <= diastolic) && (diastolic <= 80))) {
      verdict = 'Normal blood pressure';
    } else if ((systolic > 125) || (diastolic > 85)) {
      verdict = 'You might need to contact a doctor';
    }
  }
  else if ((13 < age) && (age <= 18)) {
    if (((90 <= systolic) && (systolic <= 120)) && ((50 <= diastolic) && (diastolic <= 80))) {
      verdict = 'Normal blood pressure';
    } else if ((systolic > 125) || (diastolic > 85)) {
      verdict = 'You might need to contact a doctor';
    }
  }
  else if (age <= 40) {
    if ((95 <= systolic) && (systolic <= 135) && (60 <= diastolic) && (diastolic <= 80)) {
      verdict = 'Normal blood pressure';
    } else if ((systolic > 140) || (diastolic > 85)) {
      verdict = 'You might need to contact a doctor';
    }
  }
  else if (age <= 60) {
    if (((110 <= systolic) && (systolic <= 145)) && ((70 <= diastolic) && (diastolic <= 90))) {
      verdict = 'Normal blood pressure';
    } else if ((systolic > 145) || (diastolic > 90)) {
      verdict = 'You might need to call an ambulance';
    }
  }
  else if (age <= 130) {
    if (((95 <= systolic) && (systolic <= 145)) && ((70 <= diastolic) && (diastolic <= 90))) {
      verdict = 'Normal blood pressure';
    } else if ((systolic > 145) || (diastolic > 90)) {
      verdict = 'You might need to call an ambulance';
    }
  }
  return verdict;
}

