import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { VenteFirestore } from '../vente-firestore';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface LigneVente {
  date: string;
  plat: string;
  quantite: number;
  prix: number;
  id?: string;
}

interface LigneAchat {
  date: string;
  article: string;
  montant: number;
  id?: string;
}
  


@Component({
  selector: 'app-vente',
  imports: [FormsModule, CommonModule],
  templateUrl: './vente.html',
  styleUrl: './vente.css',
})
export class Vente {
  dateChoisie = this.aujourdhui();

  plat = 'Riz sauce viande';
  quantite = 1;
  prix = 0;
  toutesVentes: LigneVente[] = [];

  article = 'Riz';
  montant = 0;
  tousAchats: LigneAchat[] = [];
  private firestore = inject(VenteFirestore);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.charger();
  }

  aujourdhui(): string {
    return this.formater(new Date());
  }

  formater(d: Date): string {
    const mois = String(d.getMonth() + 1).padStart(2, '0');
    const jour = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + mois + '-' + jour;
  }

  get debutSemaine(): string {
    const d = new Date(this.dateChoisie + 'T12:00:00');
    d.setDate(d.getDate() - 6);
    return this.formater(d);
  }

  get debutMois(): string {
    return this.dateChoisie.substring(0, 8) + '01';
  }

  get ventes(): LigneVente[] {
    return this.toutesVentes.filter((v) => v.date === this.dateChoisie);
  }

  get achats(): LigneAchat[] {
    return this.tousAchats.filter((a) => a.date === this.dateChoisie);
  }

  async ajouterVente() {
    if (this.prix <= 0 || this.quantite <= 0) {
      return;
    }
    await this.firestore.ajouterVente({
      date: this.dateChoisie,
      plat: this.plat,
      quantite: this.quantite,
      prix: this.prix,
    });
    this.quantite = 1;
    this.prix = 0;
    await this.charger();
  }

  async ajouterAchat() {
    if (this.montant <= 0) {
      return;
    }
    await this.firestore.ajouterAchat({
      date: this.dateChoisie,
      article: this.article,
      montant: this.montant,
    });
    this.montant = 0;
    await this.charger();
  }

  async supprimerVente(ligne: LigneVente) {
    if (!ligne.id) {
      return;
    }
    await this.firestore.supprimerVente(ligne.id);
    await this.charger();
  }

  async supprimerAchat(ligne: LigneAchat) {
    if (!ligne.id) {
      return;
    }
    await this.firestore.supprimerAchat(ligne.id);
    await this.charger();
  }

  async charger() {
    this.toutesVentes = (await this.firestore.lireVentes()) as LigneVente[];
    this.tousAchats = (await this.firestore.lireAchats()) as LigneAchat[];
    this.cdr.markForCheck();
  }

  ventesEntre(debut: string, fin: string): number {
    return this.toutesVentes
      .filter((v) => v.date >= debut && v.date <= fin)
      .reduce((s, v) => s + v.quantite * v.prix, 0);
  }

  achatsEntre(debut: string, fin: string): number {
    return this.tousAchats
      .filter((a) => a.date >= debut && a.date <= fin)
      .reduce((s, a) => s + a.montant, 0);
  }

  get totalVentes(): number {
    return this.ventesEntre(this.dateChoisie, this.dateChoisie);
  }

  get totalAchats(): number {
    return this.achatsEntre(this.dateChoisie, this.dateChoisie);
  }

  get benefice(): number {
    return this.totalVentes - this.totalAchats;
  }

  get ventesSemaine(): number {
    return this.ventesEntre(this.debutSemaine, this.dateChoisie);
  }

  get achatsSemaine(): number {
    return this.achatsEntre(this.debutSemaine, this.dateChoisie);
  }

  get beneficeSemaine(): number {
    return this.ventesSemaine - this.achatsSemaine;
  }

  get ventesMois(): number {
    return this.ventesEntre(this.debutMois, this.dateChoisie);
  }

  get achatsMois(): number {
    return this.achatsEntre(this.debutMois, this.dateChoisie);
  }

  get beneficeMois(): number {
    return this.ventesMois - this.achatsMois;
  }
}