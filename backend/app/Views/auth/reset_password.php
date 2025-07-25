<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - NashQuickMart</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .auth-container {
            max-width: 400px;
            margin: 100px auto;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .auth-header {
            text-align: center;
            margin-bottom: 30px;
        }
        .auth-header h2 {
            color: #333;
            margin-bottom: 10px;
        }
        .auth-header p {
            color: #666;
        }
    </style>
</head>
<body>
    <div class="auth-container">
        <div class="auth-header">
            <h2>NashQuickMart</h2>
            <p>Reset Password</p>
        </div>

        <?php if (session()->has('error')): ?>
            <div class="alert alert-danger"><?php echo session('error'); ?></div>
        <?php endif; ?>

        <?php if (session()->has('success')): ?>
            <div class="alert alert-success"><?php echo session('success'); ?></div>
        <?php endif; ?>

        <form action="<?php echo base_url('/auth/reset-password/' . $token); ?>" method="POST">
            <div class="mb-3">
                <label for="password" class="form-label">New Password</label>
                <input type="password" class="form-control" id="password" name="password" required>
            </div>
            <div class="mb-3">
                <label for="confirm_password" class="form-label">Confirm Password</label>
                <input type="password" class="form-control" id="confirm_password" name="confirm_password" required>
            </div>
            <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary">Reset Password</button>
            </div>
        </form>

        <div class="text-center mt-3">
            <a href="<?php echo base_url('/auth/login'); ?>" class="text-decoration-none">Back to Login</a>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
