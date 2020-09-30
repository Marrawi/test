const axios = require("axios");

module.exports = {
  captcha: async function (token) {
    try {

      const verifyCaptchaOptions = {
        method: 'post',
        url: 'https://www.google.com/recaptcha/api/siteverify',
        params: { secret: process.env.CAPTCHA_SECRET, response: token }
      };

      const data = await axios(verifyCaptchaOptions)

      if (!data.data.success) { return false }

      else { return true }

    } catch (e) {
      console.log(e);
    }
  }
}
