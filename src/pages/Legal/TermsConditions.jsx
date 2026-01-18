import {useEffect} from 'react'
import {Link} from 'react-router-dom'

const TermsConditions=() =>
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
          <h1 className="text-4xl font-bold text-[#1a472a] mb-4">Terms & Conditions</h1>
          <p className="text-gray-600 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="bg-white border-2 border-[#1a472a] border-dashed shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to Ayurwell. These Terms & Conditions govern your use of our website, products,
              and services. By accessing or using Ayurwell, you agree to be bound by these terms.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you do not agree with any part of these terms, please do not use our website or services.
            </p>
          </section>

          {/* Products and Services */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">2. Products and Services</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-[#2d5f3f] mb-2">Product Information</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We strive to provide accurate product descriptions, pricing, and availability. However,
                  we reserve the right to correct any errors and may update product information at any time.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Prices are subject to change without notice</li>
                  <li>Product images may differ from actual items</li>
                  <li>We reserve the right to limit quantities</li>
                  <li>Products are available while supplies last</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-[#2d5f3f] mb-2">Ayurvedic Products</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Our products are based on traditional Ayurvedic principles. Please note:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Products are not intended to diagnose, treat, cure, or prevent diseases</li>
                  <li>Consult healthcare professionals before use, especially if pregnant or nursing</li>
                  <li>Results may vary from person to person</li>
                  <li>Discontinue use if adverse reactions occur</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Orders and Payment */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">3. Orders and Payment</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-[#2d5f3f] mb-2">Order Process</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>All orders are subject to product availability</li>
                  <li>We reserve the right to refuse or cancel any order</li>
                  <li>Order confirmation does not guarantee product availability</li>
                  <li>We may contact you for additional order verification</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-[#2d5f3f] mb-2">Payment Terms</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Payment must be received before order processing</li>
                  <li>We accept various payment methods (cards, UPI, COD, etc.)</li>
                  <li>All transactions are processed securely</li>
                  <li>Prices include applicable taxes unless specified</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Shipping and Delivery */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">4. Shipping and Delivery</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-[#2d5f3f] mb-2">Delivery Terms</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Delivery times are estimates and not guaranteed</li>
                  <li>We are not liable for delays beyond our control</li>
                  <li>Free shipping on orders above ₹699</li>
                  <li>Shipping charges apply to orders below ₹699</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-[#2d5f3f] mb-2">Risk and Title</h3>
                <p className="text-gray-700 leading-relaxed">
                  Risk of loss passes to you upon delivery. Title to products passes upon full payment
                  receipt. We may use third-party shipping services and are not responsible for their actions.
                </p>
              </div>
            </div>
          </section>

          {/* Returns and Refunds */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">5. Returns and Refunds</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-[#2d5f3f] mb-2">Return Policy</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Returns accepted within 7 days of delivery</li>
                  <li>Products must be unused and in original packaging</li>
                  <li>Shipping costs for returns may apply</li>
                  <li>Custom orders and final sale items cannot be returned</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-[#2d5f3f] mb-2">Refund Process</h3>
                <p className="text-gray-700 leading-relaxed">
                  Refunds are processed within 7-10 business days after return approval.
                  Refunds will be issued to the original payment method.
                </p>
              </div>
            </div>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">6. User Accounts</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-[#2d5f3f] mb-2">Account Responsibilities</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>Notify us immediately of unauthorized account use</li>
                  <li>You are responsible for all activities under your account</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-[#2d5f3f] mb-2">Account Termination</h3>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to suspend or terminate accounts for violations of these terms,
                  fraudulent activities, or any other reason at our sole discretion.
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All content on Ayurwell, including but not limited to text, graphics, logos, images,
              and software, is the property of Ayurwell or its content suppliers and is protected
              by intellectual property laws.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>You may not use our content without permission</li>
              <li>Trademarks and trade dress may not be used without consent</li>
              <li>Reproduction of content is prohibited except as permitted by law</li>
            </ul>
          </section>

          {/* Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">8. Prohibited Activities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to engage in any of the following activities:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Use the website for illegal purposes</li>
              <li>Interfere with website functionality or security</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Spam, harass, or harm other users</li>
              <li>Upload malicious code or viruses</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To the fullest extent permitted by law:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Our liability is limited to the purchase price of products</li>
              <li>We are not liable for indirect, incidental, or consequential damages</li>
              <li>We do not guarantee uninterrupted or error-free website operation</li>
              <li>We are not responsible for third-party website content</li>
            </ul>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">10. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify and hold Ayurwell, its affiliates, officers, employees, and agents
              harmless from any claims, losses, damages, liabilities, and expenses arising from your
              use of the website or violation of these terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">11. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms & Conditions are governed by and construed in accordance with the laws
              of India, without regard to its conflict of law principles. Any disputes will be
              resolved in the courts of Indore, Madhya Pradesh.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">12. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms & Conditions, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-800">Email:</span>
                <span className="text-gray-700">support@ayurwell.com</span>
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

          {/* Terms Updates */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">13. Terms Updates</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms & Conditions from time to time. Continued use of our website
              after any changes constitutes acceptance of the new terms.
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 text-center space-y-4">
          <div className="flex justify-center space-x-6">
            <Link
              to="/privacy"
              className="text-[#1a472a] hover:text-[#2d5f3f] font-medium underline"
            >
              Privacy Policy
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

export default TermsConditions