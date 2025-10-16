import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/user.dart';
import '../models/organization.dart';
import 'api_service.dart';

class AuthProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  User? _user;
  Organization? _organization;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  Organization? get organization => _organization;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;

  AuthProvider() {
    _loadStoredAuth();
  }

  Future<void> _loadStoredAuth() async {
    try {
      final token = await _storage.read(key: 'auth_token');
      if (token != null) {
        _apiService.setToken(token);

        final userJson = await _storage.read(key: 'user');
        final orgJson = await _storage.read(key: 'organization');

        if (userJson != null) {
          _user = User.fromJson(Map<String, dynamic>.from(
              jsonDecode(userJson) as Map));
        }

        if (orgJson != null) {
          _organization = Organization.fromJson(Map<String, dynamic>.from(
              jsonDecode(orgJson) as Map));
        }

        notifyListeners();
      }
    } catch (e) {
      debugPrint('Error loading stored auth: $e');
    }
  }

  Future<void> _storeAuth(String token, User user, Organization? org) async {
    await _storage.write(key: 'auth_token', value: token);
    await _storage.write(key: 'user', value: jsonEncode(user.toJson()));
    if (org != null) {
      await _storage.write(key: 'organization', value: jsonEncode(org.toJson()));
    }
  }

  Future<void> _clearAuth() async {
    await _storage.delete(key: 'auth_token');
    await _storage.delete(key: 'user');
    await _storage.delete(key: 'organization');
  }

  Future<bool> verifyInviteCode(String code) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _apiService.verifyInviteCode(code);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register({
    required String phone,
    required String name,
    required String inviteCode,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.mobileRegister(
        phone: phone,
        name: name,
        inviteCode: inviteCode,
      );

      _user = User.fromJson(response['user'] as Map<String, dynamic>);
      _organization = response['organization'] != null
          ? Organization.fromJson(response['organization'] as Map<String, dynamic>)
          : null;

      await _storeAuth(response['token'] as String, _user!, _organization);

      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> login(String phone) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.mobileLogin(phone);

      _user = User.fromJson(response['user'] as Map<String, dynamic>);
      _organization = response['organization'] != null
          ? Organization.fromJson(response['organization'] as Map<String, dynamic>)
          : null;

      await _storeAuth(response['token'] as String, _user!, _organization);

      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    _user = null;
    _organization = null;
    _apiService.clearToken();
    await _clearAuth();
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
