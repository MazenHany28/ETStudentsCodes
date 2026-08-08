let isArabic = false;
let currentCode = "";
let currentWhatsappLink = "";
const API_URL = "https://script.google.com/macros/s/AKfycbzsFThamKWUJWuDI9SMVdbwTwG758I-2hecrIETAe7NoTuP9zO5v51fUYWtAei1k4Oz/exec";

document.addEventListener("DOMContentLoaded", () => {
  const phoneInput = document.getElementById("phone");
  const parentPhoneInput = document.getElementById("parentPhone");

  phoneInput.focus();

  [phoneInput, parentPhoneInput].forEach(input => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^\d\s]/g, "");
      input.classList.remove("input-error");
    });

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        getCode();
      }
    });
  });
});

function toggleLang() {
  isArabic = !isArabic;
  document.documentElement.lang = isArabic ? "ar" : "en";
  document.body.dir = isArabic ? "rtl" : "ltr";

  document.getElementById("langText").innerText = isArabic ? "English" : "العربية";
  document.getElementById("title").innerText = "ET in Maths";
  document.getElementById("subtitle").innerText = isArabic 
    ? "أدخل الأرقام للحصول على الكود" 
    : "Enter phone numbers to retrieve your code";
  document.getElementById("btnText").innerText = isArabic ? "عرض الكود" : "Get Code";
  document.getElementById("phone").placeholder = isArabic ? "رقم هاتف الطالب" : "Student Phone";
  document.getElementById("parentPhone").placeholder = isArabic ? "رقم هاتف ولي الأمر" : "Parent Phone";
  
  const copyBtn = document.getElementById("copyBtn");
  if (copyBtn) {
    copyBtn.innerText = isArabic ? "نسخ الكود" : "Copy Code";
  }

  const whatsappBtnText = document.getElementById("whatsappBtnText");
  if (whatsappBtnText) {
    whatsappBtnText.innerText = isArabic ? "انضم لمجموعة الواتساب" : "Join WhatsApp Group";
  }
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

function triggerShake() {
  const card = document.getElementById("card");
  card.classList.remove("shake");
  void card.offsetWidth;
  card.classList.add("shake");
}

function getCode() {
  const phoneInput = document.getElementById("phone");
  const parentPhoneInput = document.getElementById("parentPhone");

  phoneInput.classList.remove("input-error");
  parentPhoneInput.classList.remove("input-error");

  const phone = phoneInput.value.replace(/\s+/g, "");
  const parentPhone = parentPhoneInput.value.replace(/\s+/g, "");

  phoneInput.value = phone;
  parentPhoneInput.value = parentPhone;

  const studentError = validatePhoneNumber(phone, true);
  if (studentError) {
    phoneInput.classList.add("input-error");
    triggerShake();
    showResult(studentError, false);
    return;
  }

  const parentError = validatePhoneNumber(parentPhone, false);
  if (parentError) {
    parentPhoneInput.classList.add("input-error");
    triggerShake();
    showResult(parentError, false);
    return;
  }

  const btn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const loader = document.getElementById("loader");

  btn.disabled = true;
  btnText.innerText = isArabic ? "جاري التحميل..." : "Loading...";
  loader.style.display = "inline-block";

  fetch(`${API_URL}?phone=${encodeURIComponent(phone)}&parentPhone=${encodeURIComponent(parentPhone)}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        currentCode = data.code;
        currentWhatsappLink = data.whatsappLink || "";
        showResult(
          isArabic 
            ? "🎉 أهلا " + data.studentname + "، الكود الخاص بك هو: " + data.code
            : "🎉 Hi " + data.studentname + ", your code is: " + data.code,
          true,
          true,
          currentWhatsappLink
        );
      } else {
        triggerShake();
        showResult(
          isArabic ? "البيانات غير صحيحة" : "Data not found",
          false
        );
      }
    })
    .catch(() => {
      triggerShake();
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

function showResult(message, success, showCopy = false, whatsappLink = "") {
  const resultDiv = document.getElementById("result");
  const resultMsg = document.getElementById("resultMsg");
  const copyBtn = document.getElementById("copyBtn");
  const whatsappBtn = document.getElementById("whatsappBtn");
  const whatsappBtnText = document.getElementById("whatsappBtnText");

  resultDiv.style.display = "flex";
  resultDiv.className = "result " + (success ? "success" : "error");
  resultMsg.innerText = message;

  if (showCopy) {
    copyBtn.style.display = "inline-block";
    copyBtn.innerText = isArabic ? "نسخ الكود" : "Copy Code";
  } else {
    copyBtn.style.display = "none";
  }

  // Display WhatsApp Button only if a valid link exists
  if (whatsappLink && whatsappLink.length > 5) {
    whatsappBtn.href = whatsappLink;
    whatsappBtn.style.display = "inline-flex";
    whatsappBtnText.innerText = isArabic ? "انضم لمجموعة الواتساب" : "Join WhatsApp Group";
  } else {
    whatsappBtn.style.display = "none";
  }
}

function copyCode() {
  if (!currentCode) return;
  navigator.clipboard.writeText(currentCode).then(() => {
    const copyBtn = document.getElementById("copyBtn");
    copyBtn.innerText = isArabic ? "تم النسخ! ✓" : "Copied! ✓";
    setTimeout(() => {
      copyBtn.innerText = isArabic ? "نسخ الكود" : "Copy Code";
    }, 2000);
  });
}