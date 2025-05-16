import React, { useEffect, useRef } from 'react';
import { 
  Bus, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Clock,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import Chart from 'chart.js/auto';

function Dashboard() {
  const revenueChartRef = useRef(null);
  const utilizationChartRef = useRef(null);
  const revenueChartInstance = useRef(null);
  const utilizationChartInstance = useRef(null);

  // Mock data - Replace with actual API data
  const stats = {
    totalBuses: 25,
    activeBuses: 20,
    totalUsers: 1500,
    activeUsers: 1200,
    totalRevenue: 250000,
    monthlyRevenue: 75000,
    upcomingTrips: 15,
    activeTrips: 8
  };

  const recentActivity = [
    { id: 1, type: 'New Bus', description: 'Added new AC Sleeper bus TN-01-AB-1234', time: '2 hours ago' },
    { id: 2, type: 'Trip', description: 'Trip from Chennai to Bangalore completed', time: '4 hours ago' },
    { id: 3, type: 'Maintenance', description: 'Bus TN-01-AB-1235 scheduled for maintenance', time: '6 hours ago' },
    { id: 4, type: 'Booking', description: 'New booking for Trip #1234', time: '8 hours ago' },
  ];

  useEffect(() => {
    const initializeCharts = () => {
      // Revenue Chart
      if (revenueChartRef.current) {
        if (revenueChartInstance.current) {
          revenueChartInstance.current.destroy();
        }

        const ctx = revenueChartRef.current.getContext('2d');
        revenueChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Monthly Revenue (LKR)',
              data: [65000, 59000, 80000, 81000, 75000, 90000],
              borderColor: '#10B981',
              tension: 0.3,
              fill: true,
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              pointBackgroundColor: '#10B981',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: '#10B981',
              pointRadius: 4,
              pointHoverRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                  family: 'Poppins'
                },
                bodyFont: {
                  family: 'Poppins'
                },
                callbacks: {
                  label: function(context) {
                    return `Revenue: LKR ${context.parsed.y.toLocaleString()}`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                  callback: function(value) {
                    return 'LKR ' + value.toLocaleString();
                  },
                  font: {
                    family: 'Poppins'
                  }
                }
              },
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  font: {
                    family: 'Poppins'
                  }
                }
              }
            }
          }
        });
      }

      // Bus Utilization Chart
      if (utilizationChartRef.current) {
        if (utilizationChartInstance.current) {
          utilizationChartInstance.current.destroy();
        }

        const ctx = utilizationChartRef.current.getContext('2d');
        utilizationChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['AC Sleeper', 'Non-AC Sleeper', 'AC Seater', 'Non-AC Seater', 'Luxury'],
            datasets: [{
              label: 'Utilization Rate (%)',
              data: [85, 75, 90, 65, 80],
              backgroundColor: [
                'rgba(59, 130, 246, 0.6)',
                'rgba(16, 185, 129, 0.6)',
                'rgba(245, 158, 11, 0.6)',
                'rgba(139, 92, 246, 0.6)',
                'rgba(236, 72, 153, 0.6)'
              ],
              borderColor: [
                'rgb(59, 130, 246)',
                'rgb(16, 185, 129)',
                'rgb(245, 158, 11)',
                'rgb(139, 92, 246)',
                'rgb(236, 72, 153)'
              ],
              borderWidth: 1,
              borderRadius: 5
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                  family: 'Poppins'
                },
                bodyFont: {
                  family: 'Poppins'
                },
                callbacks: {
                  label: function(context) {
                    return `Utilization: ${context.parsed.y}%`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  },
                  font: {
                    family: 'Poppins'
                  }
                }
              },
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  font: {
                    family: 'Poppins'
                  }
                }
              }
            }
          }
        });
      }
    };

    // Initialize charts
    initializeCharts();

    // Cleanup function
    return () => {
      if (revenueChartInstance.current) {
        revenueChartInstance.current.destroy();
      }
      if (utilizationChartInstance.current) {
        utilizationChartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="p-4 bg-gray-50 flex flex-col item-center font-poppins justify-center ml-64">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Buses Card */}
        <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Buses</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.totalBuses}</p>
              <p className="text-sm text-green-600 flex items-center">
                <ArrowUp className="w-4 h-4 mr-1" />
                {stats.activeBuses} Active
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Bus className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Users Card */}
        <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.totalUsers}</p>
              <p className="text-sm text-green-600 flex items-center">
                <ArrowUp className="w-4 h-4 mr-1" />
                {stats.activeUsers} Active
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-800">LKR {stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 flex items-center">
                <ArrowUp className="w-4 h-4 mr-1" />
                LKR{stats.monthlyRevenue.toLocaleString()} this month
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Trips Card */}
        <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Trips</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.upcomingTrips}</p>
              <p className="text-sm text-blue-600 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {stats.activeTrips} Active
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue Overview</h2>
          <div className="h-[400px] relative">
            <canvas ref={revenueChartRef} className="w-full h-full"></canvas>
          </div>
        </div>

        {/* Bus Utilization Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Bus Utilization</h2>
          <div className="h-[400px] relative">
            <canvas ref={utilizationChartRef} className="w-full h-full"></canvas>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0">
                  {activity.type === 'New Bus' && <Bus className="w-5 h-5 text-blue-600" />}
                  {activity.type === 'Trip' && <TrendingUp className="w-5 h-5 text-green-600" />}
                  {activity.type === 'Maintenance' && <Calendar className="w-5 h-5 text-yellow-600" />}
                  {activity.type === 'Booking' && <DollarSign className="w-5 h-5 text-purple-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
