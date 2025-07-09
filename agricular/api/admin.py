from django.contrib import admin
from .models import DiseaseSolution,PlantDisease

@admin.register(DiseaseSolution)
class DiseaseSolutionAdmin(admin.ModelAdmin):
    list_display = ('key', 'disease', 'cach_xu_ly', 'nguyen_nhan', 'phong_ngua', 'thuoc')
    search_fields = ('key', 'disease')
    list_filter = ('disease',)
@admin.register(PlantDisease)
class PlanDisease(admin.ModelAdmin):
    list_display = ( 'disease', 'cach_xu_ly', 'nguyen_nhan', 'phong_ngua', 'thuoc','created_at')

