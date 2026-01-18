import {useEffect} from 'react'
import {Link} from 'react-router-dom'

const PrivacyPolicy=() =>
{
  useEffect(() =>
  {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-[#fffcef] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1a472a] mb-4">Privacy Policy</h1>
          <p className="text-gray-600 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="bg-white border-2 border-[#1a472a] border-dashed shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to Ayurwell. We respect your privacy and are committed to protecting your personal data.
              This privacy policy explains how we collect, use, store, and protect your information when you use
              our website and services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using Ayurwell, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">2. Information We Collect</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-[#2d5f3f] mb-2">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Name and contact details (email, phone number)</li>
                  <li>Shipping and billing addresses</li>
                  <li>Account credentials (username, password)</li>
                  <li>Profile information (age, gender, health concerns)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-[#2d5f3f] mb-2">Order Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Product purchase history</li>
                  <li>Payment information (processed securely)</li>
                  <li>Order tracking details</li>
                  <li>Customer service interactions</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-[#2d5f3f] mb-2">Technical Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Pages visited and time spent on site</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">3. How We Use Your Information</h2>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="text-[#1a472a] font-bold">•</span>
                <p className="text-gray-700">To process and fulfill your orders</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#1a472a] font-bold">•</span>
                <p className="text-gray-700">To provide customer support and assistance</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#1a472a] font-bold">•</span>
                <p className="text-gray-700">To personalize your shopping experience</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#1a472a] font-bold">•</span>
                <p className="text-gray-700">To send order updates and marketing communications</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#1a472a] font-bold">•</span>
                <p className="text-gray-700">To improve our website and services</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#1a472a] font-bold">•</span>
                <p className="text-gray-700">To prevent fraud and ensure security</p>
              </div>
            </div>
          </section>

          {/* Data Protection */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">4. Data Protection</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>SSL encryption for data transmission</li>
              <li>Secure payment processing through trusted gateways</li>
              <li>Regular security audits and updates</li>
              <li>Restricted access to personal data</li>
              <li>Compliance with data protection regulations</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">5. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may share your information with trusted third-party service providers:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Payment processors (Razorpay, etc.)</li>
              <li>Shipping and delivery services</li>
              <li>Email marketing services</li>
              <li>Analytics and tracking tools</li>
              <li>Customer support platforms</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              These third parties are contractually obligated to protect your information and use it only
              for providing services to us.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">6. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Access to your personal data</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your account and data</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability</li>
              <li>Restriction of processing</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">7. Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies to enhance your experience on our website:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Essential cookies for website functionality</li>
              <li>Analytics cookies to understand user behavior</li>
              <li>Marketing cookies for personalized content</li>
              <li>Preference cookies to remember your settings</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              You can control cookies through your browser settings.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">8. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-800">Email:</span>
                <span className="text-gray-700">privacy@ayurwell.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-800">Phone:</span>
                <span className="text-gray-700">+91 XXXXX XXXXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-800">Address:</span>
                <span className="text-gray-700">[Your Business Address]</span>
              </div>
            </div>
          </section>

          {/* Policy Updates */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">9. Policy Updates</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 text-center space-y-4">
          <div className="flex justify-center space-x-6">
            <Link
              to="/terms"
              className="text-[#1a472a] hover:text-[#2d5f3f] font-medium underline"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/contact"
              className="text-[#1a472a] hover:text-[#2d5f3f] font-medium underline"
            >
              Contact Us
            </Link>
            <Link
              to="/"
              className="text-[#1a472a] hover:text-[#2d5f3f] font-medium underline"
            >
              Home
            </Link>
          </div>
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Ayurwell. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy