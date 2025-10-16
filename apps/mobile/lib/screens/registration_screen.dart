import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl_phone_field/intl_phone_field.dart';
import '../services/auth_provider.dart';

class RegistrationScreen extends StatefulWidget {
  const RegistrationScreen({super.key});

  @override
  State<RegistrationScreen> createState() => _RegistrationScreenState();
}

class _RegistrationScreenState extends State<RegistrationScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _inviteCodeController = TextEditingController();

  String _completePhoneNumber = '';
  bool _inviteCodeVerified = false;

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _inviteCodeController.dispose();
    super.dispose();
  }

  Future<void> _verifyInviteCode() async {
    final code = _inviteCodeController.text.trim().toUpperCase();
    if (code.isEmpty) {
      _showError('Please enter an invite code');
      return;
    }

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final success = await authProvider.verifyInviteCode(code);

    if (success && mounted) {
      setState(() {
        _inviteCodeVerified = true;
      });
      _showSuccess('Invite code verified! You can now register.');
    } else if (mounted) {
      _showError(authProvider.error ?? 'Invalid invite code');
    }
  }

  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    if (!_inviteCodeVerified) {
      _showError('Please verify your invite code first');
      return;
    }

    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    final success = await authProvider.register(
      phone: _completePhoneNumber,
      name: _nameController.text.trim(),
      inviteCode: _inviteCodeController.text.trim().toUpperCase(),
    );

    if (success && mounted) {
      Navigator.of(context).pushReplacementNamed('/home');
    } else if (mounted) {
      _showError(authProvider.error ?? 'Registration failed');
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
      ),
    );
  }

  void _showSuccess(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Register'),
      ),
      body: Consumer<AuthProvider>(
        builder: (context, authProvider, child) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: 20),
                  const Text(
                    'Welcome to TIMA Church',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'Register with your invite code',
                    style: TextStyle(fontSize: 16, color: Colors.grey),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 40),

                  // Invite Code Field
                  TextFormField(
                    controller: _inviteCodeController,
                    decoration: InputDecoration(
                      labelText: 'Invite Code',
                      hintText: '#XXXX000',
                      prefixIcon: const Icon(Icons.card_membership),
                      suffixIcon: _inviteCodeVerified
                          ? const Icon(Icons.check_circle, color: Colors.green)
                          : IconButton(
                              icon: const Icon(Icons.verified_user),
                              onPressed: authProvider.isLoading ? null : _verifyInviteCode,
                            ),
                      border: const OutlineInputBorder(),
                    ),
                    textCapitalization: TextCapitalization.characters,
                    enabled: !_inviteCodeVerified,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter an invite code';
                      }
                      final pattern = RegExp(r'^#[A-Z0-9]{4}[0-9]{3}$');
                      if (!pattern.hasMatch(value.toUpperCase())) {
                        return 'Invalid format. Use #XXXX000';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),

                  // Name Field
                  TextFormField(
                    controller: _nameController,
                    decoration: const InputDecoration(
                      labelText: 'Full Name',
                      prefixIcon: Icon(Icons.person),
                      border: OutlineInputBorder(),
                    ),
                    enabled: _inviteCodeVerified,
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return 'Please enter your name';
                      }
                      if (value.trim().length < 2) {
                        return 'Name must be at least 2 characters';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),

                  // Phone Field
                  IntlPhoneField(
                    controller: _phoneController,
                    decoration: const InputDecoration(
                      labelText: 'Phone Number',
                      border: OutlineInputBorder(),
                    ),
                    initialCountryCode: 'IN',
                    enabled: _inviteCodeVerified,
                    onChanged: (phone) {
                      _completePhoneNumber = phone.completeNumber;
                    },
                    validator: (phone) {
                      if (phone == null || phone.number.isEmpty) {
                        return 'Please enter your phone number';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 30),

                  // Register Button
                  ElevatedButton(
                    onPressed: authProvider.isLoading || !_inviteCodeVerified
                        ? null
                        : _register,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: authProvider.isLoading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Text(
                            'Register',
                            style: TextStyle(fontSize: 16),
                          ),
                  ),
                  const SizedBox(height: 20),

                  // Login Link
                  TextButton(
                    onPressed: () {
                      Navigator.of(context).pushReplacementNamed('/login');
                    },
                    child: const Text('Already registered? Login'),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
