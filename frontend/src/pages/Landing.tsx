import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Users, DollarSign, Star, CheckCircle, Zap, Target, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Landing = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'High Returns',
      description: 'Invest in verified businesses and earn attractive returns on your investment.',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Advanced security measures and KYC verification ensure safe transactions.',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: Users,
      title: 'Diverse Projects',
      description: 'Choose from a wide range of business projects across different industries.',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      icon: DollarSign,
      title: 'Easy Funding',
      description: 'Businesses can easily raise capital from a community of investors.',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
  ];

  const stats = [
    { label: 'Active Investors', value: '10,000+', icon: Users },
    { label: 'Projects Funded', value: '500+', icon: Target },
    { label: 'Total Investment', value: '₦2.5B+', icon: DollarSign },
    { label: 'Success Rate', value: '95%', icon: CheckCircle },
  ];

  const steps = [
    {
      number: '01',
      title: 'Register & Verify',
      description: 'Create your account and complete KYC verification for secure trading.',
      icon: CheckCircle,
    },
    {
      number: '02',
      title: 'Browse or Submit',
      description: 'Investors browse projects, businesses submit funding proposals.',
      icon: Globe,
    },
    {
      number: '03',
      title: 'Invest & Earn',
      description: 'Make investments and earn returns when projects succeed.',
      icon: Zap,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-6xl mx-auto">
            <div className="animate-fade-in-up">
              <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700 border-blue-200">
                🚀 Trusted by 10,000+ investors worldwide
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Invest in the{' '}
                <span className="gradient-text">Future</span>{' '}
                of Business
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Connect investors with promising businesses. Fund growth, earn returns, 
                and be part of entrepreneurial success stories that shape tomorrow.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" asChild className="btn-primary text-lg px-8 py-4 h-auto shadow-glow">
                  <Link to="/register" className="flex items-center gap-2">
                    Start Investing <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="text-lg px-8 py-4 h-auto border-2 hover:bg-gray-50">
                  <Link to="/register">Raise Funding</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={stat.label} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
                      <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 lg:mb-20">
            <div className="animate-fade-in-up">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                Why Choose{' '}
                <span className="gradient-text">BizFundraiser?</span>
              </h2>
              <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Our platform provides a secure, transparent, and efficient way to connect 
                businesses with investors through cutting-edge technology.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Card key={feature.title} className={`card-hover border-0 shadow-lg ${feature.bgColor} animate-fade-in-up`} style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 lg:mb-20">
            <div className="animate-fade-in-up">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">How It Works</h2>
              <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
                Get started in three simple steps and begin your investment journey today.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={step.number} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-xl">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform translate-x-10"></div>
                  )}
                </div>
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Our <span className="gradient-text">Users Say</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Investor",
                content: "BizFundraiser has transformed how I invest. The platform is intuitive and the returns are excellent.",
                rating: 5,
              },
              {
                name: "Michael Chen",
                role: "Business Owner",
                content: "Raising capital has never been easier. The community of investors is amazing and supportive.",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                role: "Investor",
                content: "The security and transparency of this platform gives me confidence in every investment.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={testimonial.name} className="card-hover border-0 shadow-lg bg-white/50 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl text-center text-white p-12 lg:p-20">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="animate-fade-in-up">
                <h2 className="text-3xl lg:text-5xl font-bold mb-6">Ready to Get Started?</h2>
                <p className="text-xl lg:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                  Join thousands of investors and businesses already using our platform to build the future.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-4 h-auto bg-white text-blue-600 hover:bg-gray-100 shadow-xl">
                    <Link to="/register">Create Account Today</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 h-auto border-2 border-white text-white hover:bg-white/10">
                    <Link to="/login">Sign In</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};