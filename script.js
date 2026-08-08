let isArabic = false;

function toggleLang() {
  isArabic = !isArabic;
  document.documentElement.lang = isArabic ? "ar" : "en";
  document.body.dir = isArabic ? "rtl" : "ltr";

  // Update UI Text
  document.getElementById("langText").innerText = isArabic ? "English" : "العربية";
  document.getElementById("title").innerText = "ET in Maths";
  document.getElementById("subtitle").innerText = isArabic ? "أدخل الأرقام للحصول على الكود" : "Enter phone numbers to retrieve your code";
  document.getElementById("btnText").innerText = isArabic ? "عرض الكود" : "Get Code";
  document.getElementById("phone").placeholder = isArabic ? "رقم هاتف الطالب" : "Student Phone";
  document.getElementById("parentPhone").placeholder = isArabic ? "رقم هاتف ولي الأمر" : "Parent Phone";
}

function validatePhoneNumber(number, isStudent) {
  const fieldName = isArabic 
    ? (isStudent ? "رقم هاتف الطالب" : "رقم هاتف ولي الأمر")
    : (isStudent ? "Student phone" : "Parent phone");

  if (!number) {
    return isArabic 
      ? `يرجى إدخال ${fieldName}` 
      : `Please enter ${fieldName.toLowerCase()}`;
  }
  
  if (!/^\d+$/.test(number)) {
    return isArabic 
      ? `${fieldName} يجب أن يحتوي على أرقام فقط` 
      : `${fieldName} must contain numbers only`;
  }
  
  if (number.length !== 11) {
    return isArabic 
      ? `${fieldName} يجب أن يتكون من 11 رقمًا بالضبط (الحالي: ${number.length})` 
      : `${fieldName} must be exactly 11 digits (current length: ${number.length})`;
  }

  return null;
}

function getCode() {
  const phoneInput = document.getElementById("phone");
  const parentPhoneInput = document.getElementById("parentPhone");

  // Strip all whitespace (spaces, tabs, leading/trailing/middle spaces)
  const phone = phoneInput.value.replace(/\s+/g, "");
  const parentPhone = parentPhoneInput.value.replace(/\s+/g, "");

  // Update input fields in the UI with cleaned values
  phoneInput.value = phone;
  parentPhoneInput.value = parentPhone;

  // Validate Student Phone
  const studentError = validatePhoneNumber(phone, true);
  if (studentError) {
    showResult(studentError, false);
    return;
  }

  // Validate Parent Phone
  const parentError = validatePhoneNumber(parentPhone, false);
  if (parentError) {
    showResult(parentError, false);
    return;
  }

  const btn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const loader = document.getElementById("loader");

  btn.disabled = true;
  btnText.innerText = isArabic ? "جاري التحميل..." : "Loading...";
  loader.style.display = "inline-block";

  fetch(`https://script.google.com/macros/s/AKfycbzsFThamKWUJWuDI9SMVdbwTwG758I-2hecrIETAe7NoTuP9zO5v51fUYWtAei1k4Oz/exec?phone=${phone}&parentPhone=${parentPhone}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showResult(
          isArabic 
            ? "🎉 أهلا " + data.studentname + "، الكود الخاص بك هو: " + data.code
            : "🎉 Hi " + data.studentname + ", your code is: " + data.code,
          true
        );
      } else {
        showResult(
          isArabic ? "البيانات غير صحيحة" : "Data not found",
          false
        );
      }
    })
    .catch(() => {
      showResult(
        isArabic ? "حدث خطأ، حاول مرة أخرى" : "Something went wrong",
        false
      );
    })
    .finally(() => {
      btn.disabled = false;
      btnText.innerText = isArabic ? "عرض الكود" : "Get Code";
      loader.style.display = "none";
    });
}

function showResult(message, success) {
  const resultDiv = document.getElementById("result");
  resultDiv.style.display = "block";
  resultDiv.className = "result " + (success ? "success" : "error");
  resultDiv.innerText = message;
}