class User {
  final String id;
  final String? email;
  final String? phone;
  final String name;
  final List<String> roles;
  final String userType;
  final String? organizationId;

  User({
    required this.id,
    this.email,
    this.phone,
    required this.name,
    required this.roles,
    required this.userType,
    this.organizationId,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      email: json['email'] as String?,
      phone: json['phone'] as String?,
      name: json['name'] as String,
      roles: List<String>.from(json['roles'] as List),
      userType: json['userType'] as String,
      organizationId: json['organizationId'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'phone': phone,
      'name': name,
      'roles': roles,
      'userType': userType,
      'organizationId': organizationId,
    };
  }
}
