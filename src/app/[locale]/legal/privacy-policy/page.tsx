import { setStaticParamsLocale } from "next-international/server";
import { LanguageType } from "@/lib/validations";

export default function Page({ params: { locale } }: { params: { locale: LanguageType } }) {
  setStaticParamsLocale(locale);

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <div className="flex flex-col max-w-4xl space-y-8 p-8">
        <div className="text-4xl font-bold py-4">Privacy Policy</div>
        <div className="italic">Version 17 October 2024</div>
        <div>
          This Privacy Policy sets out the manner in which Viva Idea Pte Ltd (UEN 202435684M) (“we”, “our”, “us”)
          collect, use, manage and protect the data that is capable of identifying a user of our Platform as an
          individual whether on its own or in conjunction with other data accessible by us (“<b>Personal Data</b>”) in
          compliance with the Personal Data Protection Act 2012 of Singapore, as may be amended from time to time (“
          <b>PDPA</b>”). This Privacy Policy applies to all users of our Platform, as defined below.
        </div>
        <div>
          Capitalised words and expressions shall, unless otherwise specified or the context otherwise requires, have
          the corresponding meaning assigned to them in the Terms and Conditions of the use of our Platform.
        </div>
        <ol className="custom-ol space-y-5">
          <div className="flex flex-col">
            <li className="font-bold custom-li">Collection of information</li>
            <ol className="custom-ol">
              <li className="custom-li">
                We provide a platform for the listing of international real estate. For us to provide the Platform, it
                is necessary for us to collect and use certain Personal Data.
              </li>
              <li className="custom-li">
                While the specific types of Personal Data Users submit through our Platform may vary depending on the
                exact scope of services a User may require and whether the User maintain an account with us, there are
                some broad categories of Personal Data which are collected by us and/or our partners:
                <ol style={{ listStyleType: "lower-alpha", paddingLeft: "20px" }}>
                  <li>
                    <span className="font-semibold">Name</span>
                  </li>
                  <li>
                    <span className="font-semibold">Identity Data</span>, which includes country of residence, job
                    title, age, marital status and/or gender.
                  </li>
                  <li>
                    <span className="font-semibold">Contact Data</span>, which includes email address, fax and/or
                    telephone number.
                  </li>
                  <li>
                    <span className="font-semibold">Transaction Data</span>, which includes credit card details, billing
                    address, mailing address or the mailing address of the intended recipient of an order, payments and
                    orders made, and other details of products and services that were supplied to us or we have
                    supplied.
                  </li>
                  <li>
                    <span className="font-semibold">Usage Data</span>, which includes information about usage of the
                    Platform (including the time of visit, the duration of visit, the types of products and/or services
                    searched and/or viewed, etc.).
                  </li>
                  <li>
                    <span className="font-semibold">Marketing and Communications Data</span>, which includes interests,
                    feedback, survey responses, preferences in receiving marketing materials from us and communication
                    preferences, as well as preferences for particular products or services.
                  </li>
                  <li>
                    <span className="font-semibold">Technical Data</span>, which includes Internet Protocol (IP)
                    address, the internet device identity or media access control address of devices used to access the
                    Platform, information regarding the manufacturer, model or operating system of the device used to
                    access the Platform.
                  </li>
                </ol>
              </li>
              <li className="custom-li">
                <span className="font-bold">How we collect Personal Data</span> <div>We collect Personal Data:</div>
                <ol style={{ listStyleType: "lower-alpha", paddingLeft: "20px" }}>
                  <li style={{ marginBottom: "20px" }}>
                    <span className="font-semibold">Directly from the User.</span> You may give us your Identity,
                    Contact, Profile and Transaction Data when you do any of the following:
                    <ol style={{ listStyleType: "upper-roman", paddingLeft: "20px" }}>
                      <li>use our Platform;</li> <li>create an account on our Platform;</li>
                      <li>utilise our services or products;</li>
                      <li>apply for or enquire about our Platform, services or products;</li>
                      <li>participate in a promotion, survey, event or other marketing campaign organised by us;</li>
                      <li>subscribe to our newsletters or alerts;</li>
                      <li>request or consent to marketing materials to be sent to you; or</li>
                      <li>contact us -- for example, if you get in touch to give us some feedback.</li>
                    </ol>
                  </li>
                  <li style={{ marginBottom: "20px" }}>
                    <span className="font-bold">From your authorised representatives.</span> We may also collect your
                    Identity, Contact, Profile and Transaction Data from your authorised representatives. These include
                    persons whom you have authorised and persons who have been validly identified as acting on your
                    behalf.
                  </li>
                  <li style={{ marginBottom: "20px" }}>
                    <span className="font-bold">When you interact with our Platform.</span> As you interact with our
                    Platform, we may automatically collect your Technical Data. We may collect such personal data by
                    using website cookies.
                  </li>
                  <li style={{ marginBottom: "20px" }}>
                    <span className="font-bold">Third parties or publicly available sources.</span> We may receive your
                    Personal Data from third parties. These include:
                    <ol style={{ listStyleType: "upper-roman", paddingLeft: "20px" }}>
                      <li>
                        Technical Data from analytics providers (eg. Google), advertising networks and social media
                        platforms (eg. LinkedIn, Twitter and Facebook); and
                      </li>
                      <li>Contact and Transaction Data from providers of technical, payment and delivery services.</li>
                    </ol>
                  </li>
                </ol>
              </li>
            </ol>
          </div>
          <div className="flex flex-col">
            <li className="font-bold custom-li">Use of information</li>
            <ol className="custom-ol">
              <li className="custom-li">
                We may use your Personal Data for the following purposes:
                <ol style={{ listStyleType: "lower-alpha", paddingLeft: "20px" }}>
                  <li>To register you as a new customer.</li>
                  <li>To process and your requests and/or provide you the requested services or products.</li>
                  <li>
                    To manage your account, including managing payments, fees and charges and collecting and recovering
                    money owed to us.
                  </li>
                  <li>To manage our relationship with you.</li>
                  <li>
                    To administer, operate, provide, maintain and protect our business and our Platform (including
                    troubleshooting, data analysis, testing, system maintenance, support, reporting and hosting of data,
                    as well as ensuring that unauthorised users do not access the information on our Platform).
                  </li>
                  <li>
                    To deliver relevant content and advertisements to you and measure or understand the effectiveness of
                    the advertising we serve you.
                  </li>
                  <li>
                    To make suggestions and recommendations to you about products or services that may be of interest to
                    you.
                  </li>
                  <li>To send you relevant information about our events, news announcements or promotions.</li>{" "}
                  <li>
                    To enable you to complete a survey or participate in a promotion, survey, event or other marketing
                    campaign organised by us.
                  </li>
                  <li>To contact you in relation to all of the above.</li>
                  <li>
                    Where we have to use your Personal Data for another purpose as required by law or regulation -- for
                    example, to respond to administrative, judicial or law enforcement requests or to comply with
                    applicable laws and regulations.
                  </li>
                </ol>
              </li>
              <li className="custom-li">
                <div className="font-bold">Promotional Offers and Marketing</div>
                <div>
                  If you supply us with your Contact Data, you may receive periodic mailings, calls or faxes from us
                  with information about new products and services or upcoming events. If you do not wish to receive
                  such mailings or calls, you may “opt out” by logging into our Platform and updating your preferences
                  under “My Account”, or by or informing us via the contact details provided in Clause 11.
                </div>
              </li>
              <li className="custom-li">
                <div className="font-bold">Cookies</div>
                <div>
                  We use cookies to provide Users with a personalised experience on our Platform. Cookies are pieces of
                  information that a website transfers to the memory or hard drive of a User’s computer for
                  record-keeping purposes. We use cookies to allow access without re-entering the User having to
                  re-enter the User ID, to make improvements, and to better tailor our Platform to our User’s needs. We
                  also use this information to verify that User’s meet the criteria required to process their requests.
                  Most browsers have options that allow a User to control whether the browser will accept cookies,
                  reject cookies, or notify the User each time a cookie is sent. However, if you disable or refuse
                  cookies, please note that some parts of our Platform may become inaccessible or not function properly.
                  In addition, you are always in control and you can delete cookies from your browser program at any
                  time.
                </div>
              </li>
              <li className="custom-li">
                <div className="font-bold">Change of Purpose</div>
                <div>
                  We will only use your Personal Data for the purposes for which we collected it, unless we reasonably
                  consider that we need to use it for another reason and that reason is compatible with the original
                  purpose. If there is any change in the purposes for which we collect your Personal Data, we will
                  inform you of such change via the Platform. If you wish to get an explanation as to how the processing
                  for the new purpose is compatible with the original purpose, please contact us via the contact details
                  provided in Clause 11. If we need to use your Personal Data for an unrelated purpose, we will notify
                  you and will explain the legal basis which allows us to do so.
                </div>
              </li>
            </ol>
          </div>
          <div className="flex flex-col">
            <li className="font-bold custom-li">Disclosure of Information</li>
            <ol className="custom-ol">
              <li className="custom-li">
                We may disclose your Personal Data to our Affiliates and third parties in limited circumstances as set
                out below:
                <ol style={{ listStyleType: "lower-alpha", paddingLeft: "20px" }}>
                  <li>
                    We may share your Personal Data with our suppliers, agents or contractors in connection with
                    services they perform for us or pursuant to agreements with our suppliers.
                  </li>
                  <li>
                    We may share your Personal Data with third parties to comply with a legal obligation, when we
                    believe in good faith that an applicable law requires it, at the request of government authorities
                    conducting an investigation, to verify or enforce our contractual rights or other applicable
                    policies, to detect and protect against fraud or any technical or security vulnerabilities, to
                    respond to an emergency, or otherwise to protect the rights, property, safety or security of third
                    parties and Users to our website or the public.
                  </li>
                  <li>
                    As we continue to develop our business, we may sell or purchase assets. If another entity acquires
                    or merges with us, your Personal Data may be disclosed to such entity.
                  </li>
                  <li>
                    Also, if any bankruptcy or reorganisation proceeding is brought by or against us, all such
                    information will be considered an asset of ours and as such it is possible they will be sold or
                    transferred to third parties.
                  </li>
                </ol>
              </li>
              <li className="custom-li">
                We do not disclose your Personal Data to unaffiliated third parties for their independent use unless we
                have obtained your express consent to do so and pursuant to executing confidentiality agreements with
                such unaffiliated third parties. We also require all third parties to respect the security of your
                Personal Data and to treat it in accordance with the law.
              </li>
            </ol>
          </div>
          <div className="flex flex-col">
            <li className="font-bold custom-li">Retention of information</li>
            <ol className="custom-ol">
              <li className="custom-li">
                We only retain your Personal Data for as long as is necessary for us to use your Personal Data as
                described above. However, please be advised that we may retain some of your Personal Data after you
                cease to use our services, for instance if the data is necessary to meet our legal obligations, such as
                retaining the information for tax and accounting purposes.
              </li>
              <li className="custom-li">
                In some circumstances we may anonymise your Personal Data (so that it can no longer be associated with
                you) for research or statistical purposes in which case we may use this information indefinitely without
                further notice to you.
              </li>
            </ol>
          </div>
          <div className="flex flex-col">
            <li className="font-bold custom-li">International transfers of information</li>
            <ol className="custom-ol">
              <div className="pl-10">
                Where our partners who help us in the administration or operation of our organisation are based in other
                locations, your Personal Data may be transferred outside of Singapore. When we send your Personal Data
                outside Singapore, we will make sure that your Personal Data is protected to at least the same standard
                as that in Singapore.
              </div>
            </ol>
          </div>
          <div className="flex flex-col">
            <li className="font-bold custom-li">Security</li>
            <ol className="custom-ol">
              <div className="pl-10">
                Our management and their teams take commercially reasonable precautions to keep all information obtained
                from our online visitors secure against unauthorised access (e.g. data breach) and use and we
                periodically review our security measures. Although there is no way that any Platform can absolutely
                guarantee the security of your Personal Data, we are committed to employing reasonable security
                measures, regularly reviewing our security practices (security risk assessments / audits), and providing
                regular awareness training. You are responsible for keeping your login information (e.g. OAuth
                credentials) confidential. We deploy SSL/TLS encryption to secure data transmission, alongside
                passwordless authentication methods like magic links and OAuth (via Google, Apple and Facebook), to
                ensure maximum security. Please be aware that these protection tools do not protect information not
                collected through our Platform, such as information provided to us by e-mail.
              </div>
            </ol>
          </div>
          <div className="flex flex-col">
            <li className="font-bold custom-li">Collection of information from children</li>
            <div className="pl-10">
              We do not knowingly collect personal data from children under the age of 13. If you are under the age of
              13, please do not provide personal data of any kind whatsoever. Your parent or guardian will need to
              contact us via the contact details provided in Clause 11 to delete such information that you have
              provided.
            </div>
          </div>
          <div className="flex flex-col">
            <li className="font-bold custom-li">Making changes to your personal data</li>
            <div className="pl-10">
              You can access and edit any of the personal data that you have provided by logging into our Platform and
              updating your account details. It is your responsibility to keep your account details updated at all
              times.
            </div>
          </div>
          <div className="flex flex-col">
            <li className="font-bold custom-li">Links to External Sites</li>
            <div className="pl-10">
              Our Platform may contain links to other external sites. These external sites are not covered by this
              Privacy Policy, and we are not responsible for the privacy practices or the content of those external
              sites. It is your responsibility to check the relevant privacy practices of those external sites
            </div>
          </div>
          <div className="flex flex-col">
            <li className="font-bold custom-li">Changes to the Privacy Policy</li>
            <ol className="custom-ol">
              <li className="custom-li">
                We reserve the right to modify this Privacy Policy and related business practices at any time by posting
                updated text on this page. Please check this page periodically for updates.
              </li>
              <li className="custom-li">
                Notwithstanding and for the avoidance of doubt, your continual usage of our Platform is your implied
                consent to the Privacy Policy in place at the time of your usage.
              </li>
            </ol>
          </div>
          <div className="flex flex-col">
            <li className="font-bold custom-li">Contact Us</li>
            <div className="flex flex-col pl-10 gap-3">
              <div>
                If you have any comments, questions or complaints about our privacy policy, please contact us through
                the following channels:
              </div>
              <div>
                <div>Data Protection Officer: Mitchell Spencer</div>
                <div>Mailing Address: 68 Circular Road, #02-01, Singapore</div>
                <div>Email: mitchell@vivaideal.com</div>
              </div>
            </div>
          </div>
        </ol>
      </div>
    </div>
  );
}
