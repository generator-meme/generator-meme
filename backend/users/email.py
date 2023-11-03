from djoser import email


class Activation(email.ActivationEmail):
    template_name = "users/activation.html"
