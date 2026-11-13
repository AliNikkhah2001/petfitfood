from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("commerce", "0002_customer_ingredient_otpchallenge_order_city_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="payment_authority",
            field=models.CharField(blank=True, max_length=64),
        ),
        migrations.AddField(
            model_name="order",
            name="payment_ref_id",
            field=models.CharField(blank=True, max_length=64),
        ),
        migrations.AddField(
            model_name="order",
            name="payment_status",
            field=models.CharField(
                choices=[
                    ("unpaid", "پرداخت‌نشده"),
                    ("pending", "در انتظار پرداخت"),
                    ("paid", "پرداخت‌شده"),
                    ("failed", "ناموفق"),
                ],
                default="unpaid",
                max_length=32,
            ),
        ),
    ]
