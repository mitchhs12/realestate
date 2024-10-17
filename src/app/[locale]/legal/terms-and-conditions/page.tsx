import { setStaticParamsLocale } from "next-international/server";
import { LanguageType } from "@/lib/validations";

export default function Page({ params: { locale } }: { params: { locale: LanguageType } }) {
  setStaticParamsLocale(locale);

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <div className="flex flex-col max-w-4xl space-y-8 p-8">
        <div className="text-4xl font-bold py-4">Terms and Conditions</div>
        <div className="italic">Version 23 September 2024</div>
        <div className="italic">
          Viva Idea Pte Ltd (202435684M) (“we”, “our” or “us”) owns and operates www.vivaideal.com (“Platform”). We
          provide services for the marketing of international real estate.
        </div>
        <div className="italic">Please read these Terms and Conditions carefully before using our Platform.</div>
        <ol className="custom-ol space-y-5">
          <div className="flex flex-col">
            <li className="font-bold custom-li">Acceptance of Terms</li>
            <ol className="custom-ol">
              <li className="custom-li">
                By using our Platform, you accept our Terms and Conditions, the Privacy Policy and any other associated
                agreement(s) between you and us governing your usage of our Platform (collectively “
                <span className="font-semibold">Terms</span>”).
              </li>
              <li className="custom-li">If you do not agree to these Terms, you must not use our Platform.</li>
              <li className="custom-li">
                If you are below the age of 13, you must not use our Platform and should inform your parent or guardian
                about your visit to the Platform.
              </li>
              <li className="custom-li">
                You are responsible for keeping yourself updated as the Terms are reviewed and updated on a regular
                basis.
              </li>
            </ol>
          </div>
          <div className="flex flex-col">
            <li className="font-bold custom-li">Other Agreements and Policies</li>
            <ol className="custom-ol">
              <li className="custom-li">
                The Terms include other agreements and policies which may apply to your use of our Platform, depending
                on your usage, and includes without limitation:
                <ol style={{ listStyleType: "lower-alpha", paddingLeft: "20px" }}>
                  <li>Privacy Policy</li>
                  <li>Terms and Conditions of Sale</li>
                  <li>Terms and Conditions of Purchase</li>
                  <li>Terms of Appointment of Agent</li>
                </ol>
              </li>
            </ol>
          </div>
          <div className="flex flex-col">
            <li className="font-bold custom-li">Amendments to Terms</li>
            <ol className="custom-ol">
              <li className="custom-li">
                We will make changes to the Terms and amend these Terms from time to time. Every time you wish to use
                our Platform, please check these Terms to ensure you understand the Terms that apply at that specific
                time.
              </li>
              <li className="custom-li">
                Headers of each section within the Terms are for general reference only and shall not be interpreted to
                convey any meaning. Such headers may or may not resonate with the terms and conditions of the section.
                Nevertheless, such terms and conditions of the section will continue to apply, as it was intended,
                notwithstanding the inconsistency of the header.
              </li>
            </ol>
          </div>
          <div className="flex flex-col">
            <li className="font-bold custom-li">Modification to and Availability of Platform</li>
            <ol className="custom-ol">
              <li className="custom-li">
                We will update our Platform and may modify our service and product offerings from time to time. We do
                not guarantee that our Platform, or any content, service and product offerings displayed on it, will
                always be available or be uninterrupted. We may suspend or withdraw or restrict the availability of all
                or any part of our Platform at any time for or without any reason.
              </li>
              <li className="custom-li">
                You are also responsible for ensuring that all persons who access our Platform through you, directly or
                indirectly, are made aware of these Terms, and that such persons understand the implications.
              </li>
            </ol>
          </div>
          <div className="flex flex-col">
            <li className="font-bold custom-li"> Intellectual Property Rights </li>
            <ol className="custom-ol">
              <li className="custom-li">
                The Platform and contents located on the Platform, including any software programmes made available on
                or through the Platform, are protected by copyright, trademark and other forms of intellectual property
                rights (“<span className="font-semibold">IPR</span>”). Unless otherwise stated, all IPR should be taken
                as owned by Viva Idea Pte Ltd.
              </li>
              <li className="custom-li">
                Except as otherwise provided, the IPR of the Platform shall not be reproduced, republished, uploaded,
                posted, transmitted or otherwise distributed in any way, without our prior express consent.
              </li>
              <li className="custom-li">
                If you print off, copy or download any part of our IPR in breach of these Terms, your right to use our
                Platform ceases immediately and you must immediately destroy any copies of the material you have made.
              </li>
            </ol>
          </div>
          <div className="flex flex-col">
            <li className="font-bold custom-li">Uploading of Content</li>
            <ol className="custom-ol">
              <li className="custom-li">
                The Platform facilitates the sale of international real estate by listing real estate properties for
                sale by different Users. Any content you upload to our Platform will be considered non-confidential and
                non-proprietary. You retain all of your ownership rights in your content, but you automatically grant us
                and other Users of our Platform a limited non-revocable licence to use, store and copy that content and
                to distribute and make it available to third parties.
              </li>
              <li className="custom-li">
                We also have the right to disclose your identity to any third party who is claiming any content you
                posted or uploaded to our Platform constitutes a violation of their intellectual property rights or of
                their right to privacy, in accordance with our Privacy Policy.
              </li>
              <li className="custom-li">
                We have the right to remove any posting you make on our Platform if, in our opinion, your post is not
                genuine or is undesirable.
              </li>
            </ol>
          </div>
          <div className="flex flex-col">
            <li className="font-bold custom-li">Disclaimer of liability</li>
            <ol className="custom-ol">
              <li className="custom-li">
                The Platform is provided on an “as is” basis without warranties of any kind. To the fullest extent
                permitted by law, Viva Idea Pte Ltd does not warrant and hereby disclaim any warranty:-
                <ol style={{ listStyleType: "lower-alpha", paddingLeft: "20px" }}>
                  <li>
                    as to the accuracy, correctness, reliability, timeliness, non-infringement, title, merchantability
                    or fitness for any particular purpose of the Platform and any content located on the Platform; and
                  </li>
                  <li>
                    that the Platform availability will be uninterrupted or error-free, or that defects will be
                    corrected or that the Platform will be free of all bugs, viruses and/or other harmful elements.
                  </li>
                </ol>
              </li>
              <li className="custom-li">
                The contents on the Platform do not constitute financial, legal or other professional advice. If
                financial, legal or other professional advice is required, you should seek the services of a relevant
                competent professional.
              </li>
              <li className="custom-li">
                To the maximum extent permitted by law, we are not responsible for any loss, damage or expense,
                howsoever arising, whether direct or indirect and/or whether present, unascertained, future or
                contingent, suffered by you or any third party, arising from or in connection with your use of our
                Platform and/or the content on the Platform and/or any inaccessibility of, interruption to or outage of
                our Platform and/or any loss or corruption of data and/or the fact that the Platform and/or its content
                is incorrect, incomplete or out-of-date.
              </li>
              <li className="custom-li">
                In any event, we shall not be liable for any indirect, incidental, special or consequential damages, and
                our liability for any claim under any circumstance shall be capped at the amount you have paid us for
                our services only.
              </li>
            </ol>
          </div>
          <div className="flex flex-col">
            <li className="font-bold custom-li">Indemnity</li>
            <ol className="custom-ol">
              <li className="custom-li">
                To the maximum extent permitted by law, you shall indemnify us, and hold us harmless, against any claims
                and damages suffered or incurred by us arising from or in connection with your use of our Platform or
                any breach of these Terms or any applicable laws by you. This indemnity is a continuing obligation,
                independent from the other obligations under these Terms, and continues after these Terms end. It is not
                necessary for us to suffer or incur any damages before enforcing a right of indemnity under these Terms.
              </li>
            </ol>
          </div>
          <div className="flex flex-col">
            <li className="font-bold custom-li">Account Safety</li>
            <ol className="custom-ol">
              <li className="custom-li">
                If you have registered a user account with us, you must treat your login details as confidential. You
                must not disclose or share your account with another person.
              </li>
              <li className="custom-li">
                It is your responsibility to install any security software in order to safeguard yourself and your user
                account.
              </li>
              <li className="custom-li">
                We have the right to disable any user account, at any time if, in our reasonable opinion, you have
                failed to comply with any of the provisions of these Terms.
              </li>
              <li className="custom-li">
                If you know or suspect that anyone other than you have your login details or there is unauthorized entry
                into your user account, you must promptly notify us at mariajose@vivaideal.com.
              </li>
            </ol>
          </div>
          <div className="flex flex-col">
            <li className="font-bold custom-li">External Sites</li>
            <ol className="custom-ol">
              <li className="custom-li">
                Where our Platform contains links to external sites and resources provided by third parties, these links
                are provided for your information only. Such links should not be interpreted as approval by us of those
                external sites or information you may obtain from them. We have no control over the contents of those
                external sites or resources.
              </li>
            </ol>
          </div>
          <div className="flex flex-col">
            <li className="font-bold custom-li">Rules about linking to our Platform</li>
            <ol className="custom-ol">
              <li className="custom-li">
                Links to our Platform must be in a way that is fair and legal and does not damage our reputation or take
                advantage of it.
              </li>
              <li className="custom-li">
                You must not establish a link in such a way as to suggest any form of association, approval or
                endorsement on our part where none exists.
              </li>
              <li className="custom-li">
                You must not establish a link to our Platform in any website or platform that you do not have permission
                to establish such links.
              </li>
              <li className="custom-li">
                We always reserve the right to demand that you remove links to our Platform.
              </li>
            </ol>
          </div>
          <div className="flex flex-col">
            <li className="font-bold custom-li">Payments</li>
            <ol className="custom-ol">
              <li className="custom-li">
                You may be required to make payments to us for utilizing our services. We are not directly involved in
                the online payment but through a third-party payment service provider. Prior to making any payment It is
                your responsibility to verify that all transaction information and other details are correct. You should
                receive a confirmation email once the payment has been received by the third-party payment service
                provider.
              </li>
              <li className="custom-li">
                If you are provided with a free trial period for our products or services, you will only be charged
                after the free trial period. For the avoidance of doubt, payments made cannot be cancelled and are
                non-refundable.
              </li>
              <li className="custom-li">
                Once a payment has been made it cannot be cancelled. We do not accept any responsibility for refusal or
                reversal of payments, which shall be a matter between you and your credit card issuer. Payments made by
                credit card may attract administrative, service and/or international service fees which are not charged
                by us.
              </li>
              <li className="custom-li">
                You may contact us for any technical assistance with regards to payments at mariajose@vivaideal.com.
              </li>
            </ol>
          </div>
          <div className="flex flex-col">
            <li className="font-bold custom-li">Governing law</li>
            <ol className="custom-ol">
              <li className="custom-li">
                These Terms shall be governed and construed in accordance with the laws of Singapore.
              </li>
              <li className="custom-li">
                Any dispute arising out of or in connection with this Terms, including any question regarding its
                existence, validity or termination, shall be referred to and finally resolved by arbitration
                administered by the Singapore International Arbitration Centre (“
                <span className="font-semibold">SIAC</span>”) in accordance with the Arbitration Rules of the Singapore
                International Arbitration Centre (“<span className="font-semibold">SIAC Rules</span>”) for the time
                being in force, which rules are deemed to be incorporated by reference in this clause. The seat of the
                arbitration shall be Singapore. The Tribunal shall consist of one (1) arbitrator. The language of the
                arbitration shall be English.
              </li>
            </ol>
          </div>
        </ol>
      </div>
    </div>
  );
}
