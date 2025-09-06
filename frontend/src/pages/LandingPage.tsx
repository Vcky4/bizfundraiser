import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Shield, 
  Users, 
  DollarSign, 
  CheckCircle, 
  ArrowRight,
  Building2,
  Target
} from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">BizFundraiser</h1>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Invest in the Future of
              <span className="text-primary block">Business Growth</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect investors with promising businesses. Fund innovative projects, 
              earn competitive returns, and support economic growth through our 
              secure crowdfunding platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/register">
                  Start Investing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/register?role=business">
                  Raise Capital
                  <Building2 className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose BizFundraiser?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide a secure, transparent, and efficient platform for 
              investment crowdfunding with comprehensive risk management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Secure & Compliant</CardTitle>
                <CardDescription>
                  Bank-level security with full regulatory compliance and KYC verification
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Competitive Returns</CardTitle>
                <CardDescription>
                  Earn attractive returns on your investments with transparent ROI projections
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Diverse Opportunities</CardTitle>
                <CardDescription>
                  Access a wide range of vetted business projects across various industries
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <DollarSign className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Flexible Investment</CardTitle>
                <CardDescription>
                  Start with as little as $100 and scale your investment portfolio over time
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Target className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Risk Management</CardTitle>
                <CardDescription>
                  Comprehensive due diligence and risk assessment for every project
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Transparent Process</CardTitle>
                <CardDescription>
                  Real-time updates on project progress and investment performance
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple steps to start your investment journey or raise capital for your business
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Investors */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                For Investors
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Badge className="mr-4 mt-1">1</Badge>
                  <div>
                    <h4 className="font-semibold text-gray-900">Create Account & Complete KYC</h4>
                    <p className="text-gray-600">Sign up, verify your identity, and fund your wallet</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Badge className="mr-4 mt-1">2</Badge>
                  <div>
                    <h4 className="font-semibold text-gray-900">Browse Projects</h4>
                    <p className="text-gray-600">Explore vetted business projects with detailed information</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Badge className="mr-4 mt-1">3</Badge>
                  <div>
                    <h4 className="font-semibold text-gray-900">Invest & Track</h4>
                    <p className="text-gray-600">Make investments and monitor your portfolio performance</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Badge className="mr-4 mt-1">4</Badge>
                  <div>
                    <h4 className="font-semibold text-gray-900">Receive Returns</h4>
                    <p className="text-gray-600">Get regular updates and receive returns upon project completion</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Businesses */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                For Businesses
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Badge className="mr-4 mt-1">1</Badge>
                  <div>
                    <h4 className="font-semibold text-gray-900">Register & Verify</h4>
                    <p className="text-gray-600">Create business account and complete verification process</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Badge className="mr-4 mt-1">2</Badge>
                  <div>
                    <h4 className="font-semibold text-gray-900">Submit Project</h4>
                    <p className="text-gray-600">Create detailed project proposal with financial projections</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Badge className="mr-4 mt-1">3</Badge>
                  <div>
                    <h4 className="font-semibold text-gray-900">Get Approved</h4>
                    <p className="text-gray-600">Our team reviews and approves your project for funding</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Badge className="mr-4 mt-1">4</Badge>
                  <div>
                    <h4 className="font-semibold text-gray-900">Raise & Execute</h4>
                    <p className="text-gray-600">Raise capital from investors and execute your business plan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of investors and businesses already using BizFundraiser
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">
                Start Investing Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary" asChild>
              <Link to="/register?role=business">
                Raise Capital Now
                <Building2 className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Building2 className="h-8 w-8 text-primary mr-2" />
                <h3 className="text-xl font-bold">BizFundraiser</h3>
              </div>
              <p className="text-gray-400">
                Connecting investors with promising businesses for mutual growth and success.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Investors</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/register" className="hover:text-white">Start Investing</Link></li>
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Businesses</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/register?role=business" className="hover:text-white">Raise Capital</Link></li>
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BizFundraiser. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;