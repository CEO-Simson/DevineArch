import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_provider.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('TIMA Church'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              final authProvider = Provider.of<AuthProvider>(context, listen: false);
              await authProvider.logout();
              if (context.mounted) {
                Navigator.of(context).pushReplacementNamed('/login');
              }
            },
          ),
        ],
      ),
      body: Consumer<AuthProvider>(
        builder: (context, authProvider, child) {
          final user = authProvider.user;
          final organization = authProvider.organization;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Welcome Card
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Welcome, ${user?.name ?? "Guest"}!',
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        if (organization != null)
                          Text(
                            '${organization.name}',
                            style: const TextStyle(
                              fontSize: 16,
                              color: Colors.grey,
                            ),
                          ),
                        const SizedBox(height: 8),
                        if (user?.phone != null)
                          Row(
                            children: [
                              const Icon(Icons.phone, size: 16, color: Colors.grey),
                              const SizedBox(width: 4),
                              Text(
                                user!.phone!,
                                style: const TextStyle(color: Colors.grey),
                              ),
                            ],
                          ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Quick Actions Grid
                const Text(
                  'Quick Actions',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  mainAxisSpacing: 16,
                  crossAxisSpacing: 16,
                  children: [
                    _buildQuickActionCard(
                      context,
                      icon: Icons.people,
                      title: 'Directory',
                      subtitle: 'Church members',
                      onTap: () {
                        // Navigate to people directory
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Directory feature coming soon')),
                        );
                      },
                    ),
                    _buildQuickActionCard(
                      context,
                      icon: Icons.group,
                      title: 'Groups',
                      subtitle: 'My groups',
                      onTap: () {
                        // Navigate to groups
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Groups feature coming soon')),
                        );
                      },
                    ),
                    _buildQuickActionCard(
                      context,
                      icon: Icons.event,
                      title: 'Events',
                      subtitle: 'Upcoming events',
                      onTap: () {
                        // Navigate to events
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Events feature coming soon')),
                        );
                      },
                    ),
                    _buildQuickActionCard(
                      context,
                      icon: Icons.volunteer_activism,
                      title: 'Giving',
                      subtitle: 'Make a donation',
                      onTap: () {
                        // Navigate to giving
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Giving feature coming soon')),
                        );
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 24),

                // Announcements Section
                const Text(
                  'Announcements',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
                Card(
                  child: ListTile(
                    leading: const Icon(Icons.announcement, color: Colors.blue),
                    title: const Text('Welcome to the TIMA Church App'),
                    subtitle: const Text(
                      'More features will be added soon. Stay tuned!',
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildQuickActionCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 2,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 48, color: Theme.of(context).primaryColor),
              const SizedBox(height: 12),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 4),
              Text(
                subtitle,
                style: const TextStyle(
                  fontSize: 12,
                  color: Colors.grey,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
