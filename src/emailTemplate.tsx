export default function getEmailContent() {
  const content = `
<html lang=3D"en">
  <head>
    <!-- NAME: 1:3 COLUMN -->
    <!--[if gte mso 15]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG />
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    <![endif]-->
    <meta charset=3D"UTF-8">
    <meta http-equiv=3D"x-ua-compatible" content=3D"IE=3Dedge">
    <meta name=3D"viewport" content=3D"width=3Ddevice-width, initial-scale=
=3D1">
    <link rel=3D"preconnect" href=3D"https://fonts.gstatic.com">
    <meta name=3D"color-scheme" content=3D"light dark">
    <meta name=3D"supported-color-schemes" content=3D"light dark">
    <meta http-equiv=3D"Content-Type" content=3D"text/html;charset=3Dutf-8"=
>

    <link rel=3D"preconnect" href=3D"https://fonts.googleapis.com">
    <link rel=3D"preconnect" href=3D"https://fonts.gstatic.com" crossorigin=
>
    <link href=3D"https://fonts.googleapis.com/css2?family=3DPoppins:ital,w=
ght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300=
;1,400;1,500;1,600;1,700;1,800;1,900%26display=3Dswap" rel=3D"stylesheet">

   =20
    <style>
.footer-link {
  color: #faf4ee;
  text-decoration: underline !important;
}
.table-link {
  font-family: 'Inter', Helvetica, Verdana, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.005em;
  text-align: left;
  color: #2c71f0;
  text-decoration: none;
}
</style>
    <style>
@media (prefers-color-scheme: dark) {
  .table-header-color {
    background-color: #1b1b1b !important;
  }

  .logo-img-light {
    display: none !important;
  }

  .logo-img-dark {
    display: block !important;
  }

  .table-bg-color {
    background-color: #1b1b1b !important;
  }

  .email-title {
    color: #fff !important;
  }

  .email-subtitle {
    color: #fff !important;
  }

  .email-subtitle-color {
    color: #fff !important;
  }

  .email-action-btn {
    border: 1px solid #ccc !important;
  }

  .full-width-collapsed {
    border-collapse: separate !important;
    width: 100% !important;
  }

  .email-footer {
    color: white !important;
  }

  .email-text {
    color: #fff !important;
  }

  .email-text-2 {
    color: #fff !important;
  }

  .email-text-3 {
    color: #fff !important;
  }

  .email-subtitle-1 {
    color: #fff !important;
  }

  .email-subtitle-2 {
    color: #fff !important;
  }

  .email-subtitle-3 {
    color: #fff !important;
  }

  .email-subtitle-4 {
    color: #fff !important;
  }

  .email-subtitle-5 {
    color: #fff !important;
  }

  .email-subtitle-6 {
    color: #fff !important;
  }

  .email-subtitle-7 {
    color: #fff !important;
  }

  .text-left {
    color: #fff !important;
  }

  .email-text-black {
    color: #fff !important;
  }

  .user-name {
    color: black !important;
  }

  .gray-text {
    color: #fff !important;
  }

  .cell {
    background-color: #373737 !important;
  }

  .cell>.left {
    color: #fff !important;
  }

  .cell>.right {
    color: #fff !important;
  }

  .bg-color-daily-digest {
    background: #242424 !important;
    background-color: #242424 !important;
  }

  .cell-bg-color-daily-digest {
    background-color: #373737 !important;
    border: 1px solid #87878740 !important;
  }

  .button-daily-digest {
    color: #F2F2F2 !important;
    border: 1px solid #F2F2F2 !important;
  }

  .white-text-daily-digest {
    color: #fff !important;
  }

  .table-link {
    color: #C7E2FE !important;
  }

  .bg-light-gray {
    background-color: #373737 !important;
  }

  .box-text {
    color: #fff !important;
  }

  .box-label {
    color: #fff !important;
  }

  .box-value {
    color: #fff !important;
  }
}
[data-ogsc] .table-link {
  color: #C7E2FE !important;
}
</style>
    <style>
@media only screen and (min-width: 480px) {
  .mj-column-per-100 {
    width: 100% !important;
    max-width: 100%;
  }

  .mj-column-per-16-666666666666668 {
    width: 16.666666666666668% !important;
    max-width: 16.666666666666668%;
  }
}
@media only screen and (max-width: 768px) {
  .hide-mobile {
    display: none;
  }

  .hide-desktop {
    display: block;
  }

  .template-spacing {
    padding: 0 24px;
  }

  .email-title {
    font-family: 'Inter', Helvetica, Verdana, sans-serif;
    font-size: 24px;
    font-weight: 600;
    line-height: 40px;
    letter-spacing: -0.5px;
    text-align: center;
    margin-left: 24px;
    margin-right: 24px;
  }

  .button {
    padding: 12px 20px;
  }

  .video-placeholder {
    height: 130px;
    width: 272px;
  }
}
@media only screen and (max-width: 650px) {
  body {
    width: auto !important;
  }
}
@media only screen and (max-width: 650px) {
  .container {
    width: 95% !important;
    padding-left: 20px !important;
    padding-right: 20px !important;
  }
}
@media only screen and (max-width: 650px) {
  .image-100-percent img {
    width: 100% !important;
    height: auto !important;
    max-width: 100% !important;
  }
}
@media only screen and (max-width: 650px) {
  .full-width {
    width: 100% !important;
  }
}
@media only screen and (max-width: 650px) {
  .full-width-two {
    width: 90% !important;
  }
}
@media only screen and (max-width: 650px) {
  .text-center {
    text-align: center !important;
  }
}
@media only screen and (max-width: 650px) {
  .classremove {
    display: none !important;
  }
}
@media only screen and (max-width: 479px) {
  body {
    font-size: 14px !important;
  }
}
@media only screen and (max-width: 479px) {
  .container {
    width: 95% !important;
    padding-left: 10px !important;
    padding-right: 10px !important;
  }
}
@media only screen and (max-width: 479px) {
  .mobiletext {
    font-size: 16px !important;
    line-height: 20px !important;
  }
}
@media only screen and (max-width: 479px) {
  .mobiletitle {
    font-size: 22px !important;
    line-height: 32px !important;
  }
}
@media only screen and (max-width: 479px) {
  .image-100-percent img {
    width: 100% !important;
    height: auto !important;
    max-width: 100% !important;
    min-width: 124px !important;
  }
}
@media only screen and (max-width: 479px) {
  .full-width {
    width: 100% !important;
  }

  .footer-block {
    padding-left: 50px !important;
    padding-right: 50px !important;
  }
}
@media only screen and (max-width: 479px) {
  .full-width-two {
    width: 90% !important;
  }
}
@media only screen and (max-width: 479px) {
  .text-center {
    text-align: center !important;
  }
}
@media only screen and (max-width: 479px) {
  .hide_on_mobile {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
  }
}
@media only screen and (min-width: 768px) {
  .templateContainer {
    width: 640px !important;
  }
}
</style>
  </head>

  <body class=3D"font" style=3D"margin: 0px; font-family: 'Inter', Helvetic=
a, Verdana, sans-serif;">
    <table width=3D"560" height=3D"70" cellpadding=3D"0" cellspacing=3D"0" =
border=3D"0" class=3D"table-style table-header-color font-verdana full-widt=
h" style=3D"margin: 0 auto; overflow: hidden; font-family: 'Poppins', Verda=
na, Helvetica, sans-serif; background-color: #ffe27c;" bgcolor=3D"#ffe27c">
      <tr>
        <td width=3D"69" height=3D"26" align=3D"left" class=3D"logo-block" =
style=3D"padding: 12px 20px 12px 45px;">
          <!--HTML-->
          <img src=3D"http://cdn.mcauto-images-production.sendgrid.net/d984=
6ac2b069b34d/5a030954-6624-4951-9cf9-c844448717bf/1500x507.png" width=3D"68=
" alt=3D"Logo" class=3D"logo-img-light" style=3D"display: block; border-sty=
le: none;">
          <!--[if !mso]><! -->
          <img src=3D"http://cdn.mcauto-images-production.sendgrid.net/d984=
6ac2b069b34d/012fb173-4b54-4a81-b865-e85d2e2e031a/1500x507.png" width=3D"68=
" alt=3D"Logo" class=3D"logo-img-dark" style=3D"display: none; border-style=
: none;">
          <!--<![endif]-->
        </td>
        <td width=3D"490"></td>
      </tr>
    </table>

    <table width=3D"560" height=3D"70" cellpadding=3D"0" cellspacing=3D"0" =
border=3D"0" class=3D"table-style table-bg-color full-width" style=3D"margi=
n: 0 auto; overflow: hidden; background-color: #fffbf4; padding-top: 40px;"=
 bgcolor=3D"#fffbf4">
      <!-- (New) Welcome to Viva Ideal & Verify your email -->

<tr>
  <td align=3D"center" valign=3D"top" class=3D"fix-box">
    <table width=3D"100%" align=3D"center" border=3D"0" cellspacing=3D"0" c=
ellpadding=3D"0" class=3D"full-width">
      <tbody>
        <tr>
          <td width=3D"30">
          </td><td class=3D"p-0" style=3D"padding: 0px;">
            <table align=3D"center" cellpadding=3D"0" cellspacing=3D"0" bor=
der=3D"0" class=3D"table-collapsed" width=3D"100%" style=3D"border-collapse=
: collapse;">
              <tbody>
                <tr>
                  <td width=3D"100%">
                    <table align=3D"center" border=3D"0" cellpadding=3D"0" =
cellspacing=3D"0" class=3D"full-width">
                      <tbody>
                        <tr>
                          <td class=3D"font-verdana email-title mobiletitle=
" align=3D"center" style=3D"font-family: 'Poppins', Verdana, Helvetica, san=
s-serif; color: #01090f; font-size: 24px; text-align: center; line-height: =
40px; padding: 15px; font-weight: 500; width: 100%;" width=3D"100%">
                            Welcome to Viva Ideal!
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
          <td width=3D"30">
        </td></tr>
      </tbody>
    </table>
  </td>
</tr>

<tr>
  <td align=3D"center" valign=3D"top" class=3D"fix-box">
    <table width=3D"100%" align=3D"center" border=3D"0" cellspacing=3D"0" c=
ellpadding=3D"0" class=3D"full-width">
      <tbody>
        <tr>
          <td width=3D"30">
          </td><td class=3D"p-0" style=3D"padding: 0px;">
            <table align=3D"center" cellpadding=3D"0" cellspacing=3D"0" bor=
der=3D"0" class=3D"table-collapsed" width=3D"100%" style=3D"border-collapse=
: collapse;">
              <tbody>
                <tr>
                  <td width=3D"100%">
                    <table align=3D"center" width=3D"100%" border=3D"0" cel=
lpadding=3D"0" cellspacing=3D"0" class=3D"full-width">
                      <tbody>
                        <tr>
                          <td align=3D"left" class=3D"font-verdana email-su=
btitle" style=3D"font-family: 'Poppins', Verdana, Helvetica, sans-serif; co=
lor: #000000; font-size: 14px; text-align: left; line-height: 24px; padding=
: 15px 15px 25px; font-weight: 400; width: 100%;" width=3D"100%">
                            Thanks for signing up! At Viva Ideal we&apos;re here =
to
                            make navigating payroll and compliance for your
                            company super simple.
                            <br>
                            <br>
                            If you&apos;re ready to keep the ball rolling, =
click
                            the button below and confirm your email.
                          </td>
                        </tr>
                        <tr>
                          <td align=3D"center" class=3D"padding-10-15" styl=
e=3D"padding: 10px 15px;">
                            <table align=3D"center" border=3D"0" cellspacin=
g=3D"0" cellpadding=3D"0" class=3D"full-width button-right" style=3D"border=
-radius: 100px; background: #1b1b1b;">
                              <tbody>
                                <tr>
                                  <td>
                                    <table align=3D"center" cellpadding=3D"=
0" cellspacing=3D"0" border=3D"0" class=3D"full-width-collapsed" style=3D"b=
order-collapse: collapse; width: 100%;" width=3D"100%">
                                      <tbody>
                                        <tr>
                                          <td align=3D"center" class=3D"fon=
t-verdana email-action-btn padding-6-22" style=3D"font-family: 'Poppins', V=
erdana, Helvetica, sans-serif; background-color: #1b1b1b; border-radius: 10=
0px; font-size: 14px; text-align: center; line-height: 24px; mso-line-heigh=
t-rule: exactly; font-weight: 400; color: white; padding: 6px 22px;" bgcolo=
r=3D"#1b1b1b">
                                            <table align=3D"center" cellpad=
ding=3D"0" cellspacing=3D"0" border=3D"0" class=3D"full-width-collapsed" st=
yle=3D"border-collapse: collapse; width: 100%;" width=3D"100%">
                                              <tbody>
                                                <tr>
                                                  <td align=3D"center">
                                                    <a ses:no-track class=
=3D"white-text-block" href=3D"https://api-prod.letsdeel.com/verify/eyJhbGci=
OiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJob3N0IjoiYXBwLmRlZWwuY29tIiwiaWQiOjEwODk1ND=
csImlhdCI6MTcxMDc4Mjc2NywiZXhwIjoxNzExMDQxOTY3LCJhdWQiOiJwcm9kIiwiaXNzIjoiY=
XBpLXByb2QubGV0c2RlZWwuY29tIiwic3ViIjoidmVyaWZ5In0.M4lKc6BZPlssqcP2RA_zDTJb=
iF29q0s6tPpagHIcO9w76I9hynNd6MvyboMWudf_ActdgaMfiPqcZSp0j7Ra3TN2n_U9Go6y8NF=
nS89LOu86csRLStC5VTxgryLMH6hTiBUoylOkArjO-V4DR8ZRlvwn7pMqLTA3fhUjh_TV9946UW=
lhtYD-AZfSJDIaWTT1MbAI5Qcw5vEnZQCjPuKpP1XPeBY4GHkfMdocghnZXN0CDTMIQv_xB5X6x=
lGsUmQovu9FHe1Or5Le2XeTszfwxpSmVvP5qMGVqIJANveX2_xVPpsWYGjVrdIoNw6B17z0V2j7=
uvSBxJ-GEB8esHOszw" style=3D"color: #ffffff; text-decoration: none; display=
: block;">Confirm my email</a>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align=3D"left" class=3D"font-verdana email-fo=
oter" style=3D"font-family: 'Poppins', Verdana, Helvetica, sans-serif; colo=
r: #000000; font-size: 14px; text-align: left; line-height: 24px; padding: =
25px 15px 35px; font-weight: 400;">
                            All the best,
                            <br>
                            Viva Ideal Team
                          </td>
                        </tr>
                        <tr>
                          <td height=3D"20" class=3D"classremove">
                        </td></tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
          <td width=3D"30">
        </td></tr>
      </tbody>
    </table>
  </td>
</tr>

    </table>

    <table width=3D"100%" border=3D"0" cellspacing=3D"0" cellpadding=3D"0" =
class=3D"footer-block" style=3D"max-width: 560px; margin: 0 auto; backgroun=
d: #1b1b1b; padding-top: 50px; padding-right: 70px; padding-left: 70px; pad=
ding-bottom: 70px; background-image: linear-gradient(#1b1b1b, #1b1b1b);">
      <tr>
        <td align=3D"center">
          <table border=3D"0" cellspacing=3D"0" cellpadding=3D"0">
            <tr>
              <td align=3D"center" class=3D"text-bold-white" style=3D"paddi=
ng-bottom: 40px; font-size: 14px; font-weight: bold; color: #faf4ee;">Follo=
w us</td>
            </tr>
            <tr>
              <td align=3D"center" class=3D"pb-4" style=3D"padding-bottom: =
40px;">
                <table border=3D"0" cellspacing=3D"0" cellpadding=3D"0">
                  <tr>
                    <td align=3D"center" class=3D"ph-3" style=3D"padding: 0=
 3px;">
                      <a href=3D"https://twitter.com/deel" style=3D"text-de=
coration: none; float: left; display: block; width: 32px; height: 32px; bor=
der-radius: 50%; background-color: #3f3e3d; background-image: linear-gradie=
nt(#3f3e3d, #3f3e3d);">
                        <img src=3D"http://cdn.mcauto-images-production.sen=
dgrid.net/d9846ac2b069b34d/e882cfff-bfea-4686-8b77-8445ddb72d33/42x42.png" =
width=3D"18" height=3D"18" alt=3D"Twitter" class=3D"social-icon" style=3D"b=
order-radius: 50%; background-color: #616161; height: 18px; width: 18px; ma=
rgin-top: 6px;">
                      </a>
                    </td>
                    <td align=3D"center" class=3D"ph-3" style=3D"padding: 0=
 3px;">
                      <a href=3D"https://www.linkedin.com/company/deel" sty=
le=3D"text-decoration: none;">
                        <img src=3D"http://cdn.mcauto-images-production.sen=
dgrid.net/d9846ac2b069b34d/61e516b0-7ab3-4f87-83aa-b2bff058e14d/128x128.png=
" width=3D"32" height=3D"32" alt=3D"LinkedIn" class=3D"social-icon" style=
=3D"border-radius: 50%; width: 32px; height: 32px; background-color: #61616=
1;">
                      </a>
                    </td>
                    <td align=3D"center" class=3D"ph-3" style=3D"padding: 0=
 3px;">
                      <a href=3D"https://www.facebook.com/GetDeel" style=3D=
"text-decoration: none;">
                        <img src=3D"http://cdn.mcauto-images-production.sen=
dgrid.net/d9846ac2b069b34d/f14ad3f5-8283-4b42-9dec-6cfd3f1af21f/96x96.png" =
width=3D"32" height=3D"32" alt=3D"Facebook" class=3D"social-icon" style=3D"=
border-radius: 50%; width: 32px; height: 32px; background-color: #616161;">
                      </a>
                    </td>
                    <td align=3D"center" class=3D"ph-3" style=3D"padding: 0=
 3px;">
                      <a href=3D"https://www.instagram.com/getdeel" style=
=3D"text-decoration: none;">
                        <img src=3D"http://cdn.mcauto-images-production.sen=
dgrid.net/d9846ac2b069b34d/c9eb0584-cb19-4d05-acac-3ea20782a580/96x96.png" =
alt=3D"Instagram" class=3D"social-icon" style=3D"border-radius: 50%; width:=
 32px; height: 32px; background-color: #616161;" width=3D"32" height=3D"32"=
>
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align=3D"center" class=3D"footer-text pb-40" style=3D"fon=
t-size: 12px; color: #faf4ee; text-align: center; font-size: 12px; font-sty=
le: normal; font-weight: 400; line-height: 150%; padding-bottom: 40px;">
                650 2nd Street, San Francisco, California, 94107, USA<br>=
=C2=A9
                Copyright 2023. All Rights Reserved.
              </td>
            </tr>
            <tr>
              <td align=3D"center" class=3D"pb-60" style=3D"padding-bottom:=
 60px;">
                <!-- Replace the '#' with your actual URL and add the corre=
ct image path -->
                <a href=3D"#" style=3D"text-decoration: none;">
                  <img src=3D"http://cdn.mcauto-images-production.sendgrid.=
net/d9846ac2b069b34d/012fb173-4b54-4a81-b865-e85d2e2e031a/1500x507.png" wid=
th=3D"80" alt=3D"Deel Logo">
                </a>
              </td>
            </tr>
            <tr>
              <td align=3D"center" class=3D"footer-text pb-16" style=3D"fon=
t-size: 12px; color: #faf4ee; text-align: center; font-size: 12px; font-sty=
le: normal; font-weight: 400; line-height: 150%; padding-bottom: 16px;">
                This is a no-reply email,
                <br>
                please
                <a href=3D"https://help.letsdeel.com/hc/en-gb/requests/new"=
 class=3D"footer-link" style=3D"color: #faf4ee; text-decoration: underline;=
">contact us</a>
                for support
              </td>
            </tr>
            <tr>
              <td align=3D"center" class=3D"footer-text" style=3D"font-size=
: 12px; color: #faf4ee; text-align: center; font-size: 12px; font-style: no=
rmal; font-weight: 400; line-height: 150%;">
                To manage the emails you receive, go to
                <a href=3D"https://app.deel.com/settings/notification-setti=
ngs" class=3D"footer-link" style=3D"color: #faf4ee; text-decoration: underl=
ine;">
                  notification settings
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  <img alt=3D"" src=3D"https://my3snmjl.r.eu-west-1.awstrack.me/I0/0102018e=
5299621b-b5f95cbc-15c2-40f8-817e-f95ca6506162-000000/E3zKTQOo8fG-KzPBNJ1ADk=
drZXM=3D365" style=3D"display: none; width: 1px; height: 1px;">
</body>
</html>`;

  return content;
}
