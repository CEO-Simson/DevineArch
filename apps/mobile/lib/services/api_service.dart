import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user.dart';

class ApiService {
  // TODO: Update this to your actual API URL
  // For development, use your local IP address, not localhost
  // Example: 'http://192.168.1.100:4000'
  static const String baseUrl = 'http://localhost:4000';

  String? _token;

  void setToken(String token) {
    _token = token;
  }

  String? getToken() {
    return _token;
  }

  void clearToken() {
    _token = null;
  }

  Map<String, String> _getHeaders({bool includeAuth = true}) {
    final headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && _token != null) {
      headers['Authorization'] = 'Bearer $_token';
    }

    return headers;
  }

  // Verify invite code
  Future<Map<String, dynamic>> verifyInviteCode(String code) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/invites/verify/$code'),
      headers: _getHeaders(includeAuth: false),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body) as Map<String, dynamic>;
    } else {
      final error = json.decode(response.body);
      throw Exception(error['error'] ?? 'Failed to verify invite code');
    }
  }

  // Mobile user registration
  Future<Map<String, dynamic>> mobileRegister({
    required String phone,
    required String name,
    required String inviteCode,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/mobile/register'),
      headers: _getHeaders(includeAuth: false),
      body: json.encode({
        'phone': phone,
        'name': name,
        'inviteCode': inviteCode,
      }),
    );

    if (response.statusCode == 201) {
      final data = json.decode(response.body) as Map<String, dynamic>;
      _token = data['token'] as String;
      return data;
    } else {
      final error = json.decode(response.body);
      throw Exception(error['error'] ?? 'Registration failed');
    }
  }

  // Mobile user login
  Future<Map<String, dynamic>> mobileLogin(String phone) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/mobile/login'),
      headers: _getHeaders(includeAuth: false),
      body: json.encode({
        'phone': phone,
      }),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body) as Map<String, dynamic>;
      _token = data['token'] as String;
      return data;
    } else {
      final error = json.decode(response.body);
      throw Exception(error['error'] ?? 'Login failed');
    }
  }

  // Get user profile
  Future<User> getUserProfile() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/auth/me'),
      headers: _getHeaders(),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body) as Map<String, dynamic>;
      return User.fromJson(data['user'] as Map<String, dynamic>);
    } else {
      throw Exception('Failed to load user profile');
    }
  }

  // Placeholder methods for future features
  // These will be implemented based on the backend API

  Future<List<dynamic>> getPeople() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/people'),
      headers: _getHeaders(),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body) as Map<String, dynamic>;
      return data['people'] as List<dynamic>;
    } else {
      throw Exception('Failed to load people');
    }
  }

  Future<List<dynamic>> getGroups() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/people/groups'),
      headers: _getHeaders(),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body) as Map<String, dynamic>;
      return data['groups'] as List<dynamic>;
    } else {
      throw Exception('Failed to load groups');
    }
  }

  Future<List<dynamic>> getEvents() async {
    // TODO: Implement when events API is available
    return [];
  }

  Future<Map<String, dynamic>> getGivingStats() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/giving/stats'),
      headers: _getHeaders(),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body) as Map<String, dynamic>;
    } else {
      throw Exception('Failed to load giving stats');
    }
  }
}
