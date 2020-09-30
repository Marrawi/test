const AppError = (text) => {

  const AllErrors = [
    { title: 'Already_Sign_In', code: 405, massage: 'لقد تم تسجيل الدخول مسبقاً' },
    { title: 'Account_Not_Found', code: 400, massage: 'هذا الحساب غير موجود' },
    { title: 'Account_Already_Verified', code: 400, massage: 'هذا الحساب تم تفعيله مسبقاً' },
    { title: 'Must_Sign_In', code: 404, massage: 'يجب أن تقوم بتسجيل الدخول أولاًً' },
    { title: 'Wait_Email_Sending', code: 405, massage: 'تم إرسال إيميل لحسابك خلال فترة قريبة .. الرجاء الانتظار دقيقة واحدة' },
    { title: 'Incorrect_Password', code: 400, massage: 'كلمة السر غير صحيحة' },
    { title: 'Withdraw_Already_Active', code: 400, massage: 'لا يمكنك طلب السحب في حال وجود طلب آخر نشط بعد' },
    { title: 'Withdraw_limit', code: 400, massage: 'لم تصل بعد إلى الحد الأدنى لسحب المال' },
    { title: 'Task_Not_Found', code: 406, massage: 'هذه المهمة غير موجودة' },
    { title: 'Task_Already_Finished', code: 405, massage: 'لقد قمت بتنفيذ المهمة مسبقاً' },
    { title: 'Task_Already_Closed', code: 405, massage: 'هذه المهمة تم إغلاقها' },
    { title: 'Phone_Unique', code: 400, massage: 'ًرقم الهاتف مستخدم مسبقاً' },
    {
      title: 'Captcha_Error', code: 406,
      massage: 'لقد فشل التأكد من كود الكابتشا , الرجاء المحاولة مرة أخرى أو اتصل بنا في حال تكرر المشكلة'
    },
    {
      title: 'Email_Sending_Error', code: 409,
      massage: 'لقد حصلت مشكلة في إرسال الإيميل، الرجاء المحاولة لاحقاً أو اتصل بنا في حال تكرر المشكلة'
    },
    {
      title: 'Account_Not_Verified', code: 400,
      massage: 'هذا الحساب لم يتم تفعيله بعد , الرجاء تفعيل حسابك من خلال الضغط على الرابط في البريد الإلكتروني'
    },
    {
      title: 'Unique_Variable', code: 400,
      massage: 'الإيميل أو اسم المستخدم أو رقم الهاتف تم استخدامه من قبل .. الرجاء استخدام معلومات جديدة'
    },
    {
      title: 'Email_Verify_Error', code: 409,
      massage: 'لقد حصل خطأ ما, الرجاء الذهاب لصفحة إرسال الإيميل وطلب إيميل جديد لتفعيل الحساب أو اتصل بنا في حال تكرر المشكلة'
    }
  ];

  let code, massage;

  for (var i = 0; i < AllErrors.length; i++) {
    if (AllErrors[i].title == text) {
      code = AllErrors[i].code;
      massage = AllErrors[i].massage;
      break;
    }
  }

  return {
    __typename: "Error",
    status: false,
    code: code,
    massage: massage
  }

}

module.exports = AppError;
