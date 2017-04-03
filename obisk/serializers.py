from rest_framework import serializers
from .models import *

class ObiskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Obisk
        fields = ('id')