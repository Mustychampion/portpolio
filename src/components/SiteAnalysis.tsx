import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Package, ShoppingCart, Users, Mail, MessageSquare, DollarSign, BarChart3, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalyticsData {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  totalCategories: number;
  totalContactSubmissions: number;
  totalNewsletterSubscribers: number;
  productsByCategory: { category: string; count: number }[];
  productsByPriceRange: { range: string; count: number }[];
  contactSubmissionsByStatus: { status: string; count: number }[];
  newsletterSubscriptionsByStatus: { status: string; count: number }[];
  productsCreatedOverTime: { date: string; count: number }[];
  contactSubmissionsOverTime: { date: string; count: number }[];
  newsletterSubscriptionsOverTime: { date: string; count: number }[];
  averagePrice: number;
  totalValue: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const SiteAnalysis = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Calculate date filter
      const now = new Date();
      let startDate: Date | null = null;
      if (dateRange === "7d") {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateRange === "30d") {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (dateRange === "90d") {
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      }

      // Fetch products
      let productsQuery = supabase.from("products").select("*");
      if (startDate) {
        productsQuery = productsQuery.gte("created_at", startDate.toISOString());
      }
      const { data: products = [] } = await productsQuery;

      // Fetch categories
      const { data: categories = [] } = await supabase.from("categories").select("*");

      // Fetch contact submissions
      let contactQuery = supabase.from("contact_submissions").select("*");
      if (startDate) {
        contactQuery = contactQuery.gte("created_at", startDate.toISOString());
      }
      const { data: contactSubmissions = [] } = await contactQuery;

      // Fetch newsletter subscriptions
      let newsletterQuery = supabase.from("newsletter_subscriptions").select("*");
      if (startDate) {
        newsletterQuery = newsletterQuery.gte("subscribed_at", startDate.toISOString());
      }
      const { data: newsletterSubscriptions = [] } = await newsletterQuery;

      // Process products data
      const totalProducts = products.length;
      const inStockProducts = products.filter(p => p.in_stock).length;
      const outOfStockProducts = totalProducts - inStockProducts;

      // Products by category
      const categoryMap = new Map<string, number>();
      products.forEach(product => {
        const count = categoryMap.get(product.category) || 0;
        categoryMap.set(product.category, count + 1);
      });
      const productsByCategory = Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count,
      }));

      // Products by price range
      const priceRanges = [
        { range: "$0-$50", min: 0, max: 50 },
        { range: "$50-$100", min: 50, max: 100 },
        { range: "$100-$200", min: 100, max: 200 },
        { range: "$200+", min: 200, max: Infinity },
      ];
      const priceRangeMap = new Map<string, number>();
      priceRanges.forEach(range => {
        priceRangeMap.set(range.range, 0);
      });
      products.forEach(product => {
        const price = parseFloat(product.price.replace(/[^0-9.]/g, "")) || 0;
        for (const range of priceRanges) {
          if (price >= range.min && price < range.max) {
            const count = priceRangeMap.get(range.range) || 0;
            priceRangeMap.set(range.range, count + 1);
            break;
          }
        }
      });
      const productsByPriceRange = Array.from(priceRangeMap.entries()).map(([range, count]) => ({
        range,
        count,
      }));

      // Contact submissions by status
      const statusMap = new Map<string, number>();
      contactSubmissions.forEach(submission => {
        const status = submission.status || "pending";
        const count = statusMap.get(status) || 0;
        statusMap.set(status, count + 1);
      });
      const contactSubmissionsByStatus = Array.from(statusMap.entries()).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count,
      }));

      // Newsletter subscriptions by status
      const newsletterStatusMap = new Map<string, number>();
      newsletterSubscriptions.forEach(sub => {
        const status = sub.status || "active";
        const count = newsletterStatusMap.get(status) || 0;
        newsletterStatusMap.set(status, count + 1);
      });
      const newsletterSubscriptionsByStatus = Array.from(newsletterStatusMap.entries()).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count,
      }));

      // Products created over time
      const productsByDate = new Map<string, number>();
      products.forEach(product => {
        const date = new Date(product.created_at).toISOString().split("T")[0];
        const count = productsByDate.get(date) || 0;
        productsByDate.set(date, count + 1);
      });
      const productsCreatedOverTime = Array.from(productsByDate.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Contact submissions over time
      const contactsByDate = new Map<string, number>();
      contactSubmissions.forEach(submission => {
        const date = new Date(submission.created_at).toISOString().split("T")[0];
        const count = contactsByDate.get(date) || 0;
        contactsByDate.set(date, count + 1);
      });
      const contactSubmissionsOverTime = Array.from(contactsByDate.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Newsletter subscriptions over time
      const newslettersByDate = new Map<string, number>();
      newsletterSubscriptions.forEach(sub => {
        const date = new Date(sub.subscribed_at).toISOString().split("T")[0];
        const count = newslettersByDate.get(date) || 0;
        newslettersByDate.set(date, count + 1);
      });
      const newsletterSubscriptionsOverTime = Array.from(newslettersByDate.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Calculate average price and total value
      const prices = products.map(p => parseFloat(p.price.replace(/[^0-9.]/g, "")) || 0);
      const averagePrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
      const totalValue = prices.reduce((a, b) => a + b, 0);

      setAnalytics({
        totalProducts,
        inStockProducts,
        outOfStockProducts,
        totalCategories: categories.length,
        totalContactSubmissions: contactSubmissions.length,
        totalNewsletterSubscribers: newsletterSubscriptions.length,
        productsByCategory,
        productsByPriceRange,
        contactSubmissionsByStatus,
        newsletterSubscriptionsByStatus,
        productsCreatedOverTime,
        contactSubmissionsOverTime,
        newsletterSubscriptionsOverTime,
        averagePrice,
        totalValue,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return <div>No analytics data available</div>;
  }

  const stockPercentage = analytics.totalProducts > 0 
    ? ((analytics.inStockProducts / analytics.totalProducts) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Site Analytics</h2>
          <p className="text-muted-foreground">Comprehensive insights into your site performance</p>
        </div>
        <div className="flex gap-2">
          {(["7d", "30d", "90d", "all"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                dateRange === range
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {range === "all" ? "All Time" : range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.inStockProducts} in stock, {analytics.outOfStockProducts} out of stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              Active product categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Submissions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalContactSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              Total inquiries received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalNewsletterSubscribers}</div>
            <p className="text-xs text-muted-foreground">
              Active subscribers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.averagePrice.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Average product price
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Combined product value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Status</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockPercentage}%</div>
            <p className="text-xs text-muted-foreground">
              Products in stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products per Category</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalCategories > 0 
                ? (analytics.totalProducts / analytics.totalCategories).toFixed(1)
                : "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Average products per category
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="products" className="w-full">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Products by Category</CardTitle>
                <CardDescription>Distribution of products across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.productsByCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Products by Price Range</CardTitle>
                <CardDescription>Distribution of products by price</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.productsByPriceRange}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ range, percent }) => `${range}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics.productsByPriceRange.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contact Submissions by Status</CardTitle>
                <CardDescription>Status distribution of contact inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.contactSubmissionsByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics.contactSubmissionsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Submissions Over Time</CardTitle>
                <CardDescription>Trend of contact submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.contactSubmissionsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#0088FE" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="newsletter" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Subscriptions by Status</CardTitle>
                <CardDescription>Status distribution of newsletter subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.newsletterSubscriptionsByStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Newsletter Subscriptions Over Time</CardTitle>
                <CardDescription>Growth of newsletter subscribers</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.newsletterSubscriptionsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#00C49F" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Products Created Over Time</CardTitle>
              <CardDescription>Growth trend of product additions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analytics.productsCreatedOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} name="Products Added" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Combined Growth Trends</CardTitle>
                <CardDescription>All metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    ...analytics.productsCreatedOverTime.map(p => ({ date: p.date, Products: p.count, Contacts: 0, Newsletters: 0 })),
                    ...analytics.contactSubmissionsOverTime.map(c => ({ date: c.date, Products: 0, Contacts: c.count, Newsletters: 0 })),
                    ...analytics.newsletterSubscriptionsOverTime.map(n => ({ date: n.date, Products: 0, Contacts: 0, Newsletters: n.count })),
                  ].reduce((acc, curr) => {
                    const existing = acc.find(item => item.date === curr.date);
                    if (existing) {
                      existing.Products += curr.Products;
                      existing.Contacts += curr.Contacts;
                      existing.Newsletters += curr.Newsletters;
                    } else {
                      acc.push(curr);
                    }
                    return acc;
                  }, [] as { date: string; Products: number; Contacts: number; Newsletters: number }[]).sort((a, b) => a.date.localeCompare(b.date))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Products" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="Contacts" stroke="#0088FE" strokeWidth={2} />
                    <Line type="monotone" dataKey="Newsletters" stroke="#00C49F" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Top performing categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.productsByCategory
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5)
                    .map((item, index) => (
                      <div key={item.category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{index + 1}.</span>
                          <span className="text-sm">{item.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${(item.count / analytics.totalProducts) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8 text-right">{item.count}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};


