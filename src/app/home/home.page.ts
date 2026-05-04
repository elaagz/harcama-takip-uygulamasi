import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonInput,
  IonItem, IonButton, IonList, IonLabel, IonItemSliding,
  IonItemOptions, IonItemOption, IonToast, IonSelect, IonSelectOption,
  IonCard, IonCardContent, IonBadge, IonDatetime, IonDatetimeButton, IonModal
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonInput,
    IonItem, IonButton, IonList, IonLabel, IonItemSliding,
    IonItemOptions, IonItemOption, IonToast, IonSelect, IonSelectOption,
    IonCard, IonCardContent, IonBadge, IonDatetime, IonDatetimeButton, IonModal
  ],
})
export class HomePage implements OnInit {

  harcamaAdi: string = '';
  harcamaTutari: number | null = null;
  secilenKategori: string = '';

  harcamalar: any[] = [];
  toplamTutar: number = 0;

  isToastOpen: boolean = false;
  toastMessage: string = '';

  secilenTarih: string = new Date().toISOString();

  constructor(private alertCtrl: AlertController) {}

  ngOnInit(): void {
    const data = localStorage.getItem('harcamalarim');

    if (data) {
      this.harcamalar = JSON.parse(data);
      this.hesapla();
    }
  }

  harcamaEkle() {
    if (this.harcamaAdi.trim() == '' || this.harcamaTutari == null || this.harcamaTutari <= 0 || this.secilenKategori == '') {
      this.toastMessage = 'Lütfen bilgileri eksiksiz giriniz.';
      this.isToastOpen = true;
      return;
    }

    const yeniHarcama = {
      baslik: this.harcamaAdi,
      tutar: this.harcamaTutari,
      kategori: this.secilenKategori,
      tarih: new Date(this.secilenTarih).toLocaleDateString('tr-TR')
    };

    this.harcamalar.push(yeniHarcama);
    this.kaydet();

    this.harcamaAdi = '';
    this.harcamaTutari = null;
    this.secilenKategori = '';
    this.secilenTarih = new Date().toISOString();

    this.toastMessage = 'Harcama başarıyla eklendi.';
    this.isToastOpen = true;
    
  }

  async sil(index: number) {
  const alert = await this.alertCtrl.create({
    header: 'Silme',
    message: 'Bu harcamayı silmek istiyor musunuz?',
    buttons: [
      {
        text: 'İptal',
        role: 'cancel'
      },
      {
        text: 'Sil',
        handler: () => {
          this.harcamalar.splice(index, 1);
          this.kaydet();

          this.toastMessage = 'Harcama silindi.';
          this.isToastOpen = true;
        }
      }
    ]
  });

  await alert.present();
}

  kaydet() {
    localStorage.setItem('harcamalarim', JSON.stringify(this.harcamalar));
    this.hesapla();
  }

  hesapla() {
    let toplam = 0;

    for (let h of this.harcamalar) {
      toplam += Number(h.tutar);
    }

    this.toplamTutar = toplam;
  }

  kategoriRenk(kategori: string) {
    if (kategori == 'Mutfak/Gıda') {
      return 'warning';
    } else if (kategori == 'Ulaşım') {
      return 'tertiary';
    } else if (kategori == 'Eğlence/Sosyal') {
      return 'danger';
    } else if (kategori == 'Giyim') {
      return 'primary';
    } else if (kategori == 'Eğitim') {
      return 'success';
    } else {
      return 'medium';
    }
  }
}
