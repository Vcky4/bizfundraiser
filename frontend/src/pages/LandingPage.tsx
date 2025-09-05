import { Link } from 'react-router-dom'
import { 
  ArrowRightIcon, 
  CheckIcon, 
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Secure Investments',
    description: 'Your investments are protected with our escrow system and comprehensive due diligence.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Diverse Projects',
    description: 'Invest in a wide range of vetted business projects across various industries.',
    icon: BuildingOfficeIcon,
  },
  {
    name: 'Transparent Returns',
    description: 'Clear, upfront information about expected returns and project timelines.',
    icon: ChartBarIcon,
  },
  {
    name: 'Easy Withdrawals',
    description: 'Withdraw your returns and principal easily through our secure platform.',
    icon: CurrencyDollarIcon,
  },
]

const stats = [
  { name: 'Total Projects Funded', value: '150+' },
  { name: 'Investors', value: '2,500+' },
  { name: 'Total Amount Raised', value: '₦500M+' },
  { name: 'Average Returns', value: '25%' },
]

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">BizFundraiser</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary-600 font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Invest in Nigeria's
              <span className="block text-primary-200">Growing Businesses</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-primary-100">
              Connect with promising businesses and earn attractive returns while supporting economic growth. 
              Our platform makes investment crowdfunding simple, secure, and profitable.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/register"
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Start Investing
                <ArrowRightIcon className="ml-2 h-5 w-5 inline" />
              </Link>
              <Link
                to="/projects"
                className="text-white font-semibold hover:text-primary-200 transition-colors"
              >
                Browse Projects
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="text-center">
                <div className="text-3xl font-bold text-primary-600">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose BizFundraiser?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We provide a secure, transparent, and profitable investment platform
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="text-center">
                <div className="mx-auto h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How It Works
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Sign Up & Verify</h3>
              <p className="mt-2 text-gray-600">
                Create your account and complete KYC verification to start investing
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Browse & Invest</h3>
              <p className="mt-2 text-gray-600">
                Explore vetted business projects and invest in those that match your goals
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Earn Returns</h3>
              <p className="mt-2 text-gray-600">
                Receive regular updates and earn returns when projects succeed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Start Investing?
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              Join thousands of investors who are already earning with BizFundraiser
            </p>
            <div className="mt-8">
              <Link
                to="/register"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white">BizFundraiser</h3>
            <p className="mt-2 text-gray-400">
              Empowering businesses and investors through crowdfunding
            </p>
            <p className="mt-4 text-sm text-gray-500">
              © 2024 BizFundraiser. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}