let isArabic = false;


function toggleLang() {
  isArabic = !isArabic;
  document.documentElement.lang = isArabic ? "ar" : "en";
  document.body.dir = isArabic ? "rtl" : "ltr";

  // Update UI Text
  document.getElementById("langText").innerText = isArabic ? "English" : "العربية";
  document.getElementById("title").innerText = isArabic ? "ET in Maths" : "ET in Maths";
  document.getElementById("subtitle").innerText = isArabic ? "أدخل الأرقام للحصول على الكود" : "Enter phone numbers to retrieve your code";
  document.getElementById("btnText").innerText = isArabic ? "عرض الكود" : "Get Code";
    document.getElementById("phone").placeholder = isArabic ? "رقم هاتف الطالب" : "Student Phone";
      document.getElementById("parentPhone").placeholder = isArabic ? "رقم هاتف ولي الأمر" : "Parent Phone";
}

function getCode() {
  const phone = document.getElementById("phone").value.trim();
  const parentPhone = document.getElementById("parentPhone").value.trim();
  const resultDiv = document.getElementById("result");
  const btn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const loader = document.getElementById("loader");


  if (!phone || !parentPhone) {
    showResult(isArabic ? "يرجى إدخال البيانات كاملة"
                        : "Please fill in both fields", false);
    return;
  }

  btn.disabled = true;
  btnText.innerText = isArabic ? "جاري التحميل..." : "Loading...";
  loader.style.display = "inline-block";

 fetch(`https://script.google.com/macros/s/AKfycbzsFThamKWUJWuDI9SMVdbwTwG758I-2hecrIETAe7NoTuP9zO5v51fUYWtAei1k4Oz/exec?phone=${phone}&parentPhone=${parentPhone}`)
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log(data);
      showResult(
        isArabic 
      ? "🎉 أهلا " + data.studentname + "، الكود الخاص بك هو: " + data.code
      : "🎉 Hi " + data.studentname + ", your code is: " + data.code,
        true
      );
    } else {
      showResult(
        isArabic ? "البيانات غير صحيحة"
                 : "Data not found",
        false
      );
    }
  })
  .catch(() => {
    console.error("Error fetching code");
    console.error("خطأ في جلب الكود");
    showResult(
      isArabic ? "حدث خطأ، حاول مرة أخرى"
               : "Something went wrong",
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