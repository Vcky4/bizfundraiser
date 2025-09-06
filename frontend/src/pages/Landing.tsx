import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const Landing = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'High Returns',
      description: 'Invest in verified businesses and earn attractive returns on your investment.',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Advanced security measures and KYC verification ensure safe transactions.',
    },
    {
      icon: Users,
      title: 'Diverse Projects',
      description: 'Choose from a wide range of business projects across different industries.',
    },
    {
      icon: DollarSign,
      title: 'Easy Funding',
      description: 'Businesses can easily raise capital from a community of investors.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Invest in the Future of Business
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect investors with promising businesses. Fund growth, earn returns, 
            and be part of entrepreneurial success stories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/register" className="flex items-center">
                Start Investing <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/register">Raise Funding</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose BizFundraiser?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform provides a secure, transparent, and efficient way to connect 
            businesses with investors.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Register & Verify</h3>
              <p className="text-gray-600">
                Create your account and complete KYC verification for secure trading.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse or Submit</h3>
              <p className="text-gray-600">
                Investors browse projects, businesses submit funding proposals.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Invest & Earn</h3>
              <p className="text-gray-600">
                Make investments and earn returns when projects succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-blue-600 rounded-2xl text-center text-white p-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of investors and businesses already using our platform.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">Create Account Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};