import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { firebaseConfig } from '../firebase.config';

@Injectable({
  providedIn: 'root',
})
export class VenteFirestore {
  private app = initializeApp(firebaseConfig);
  private db = getFirestore(this.app);

  // Ajouter une vente
  async ajouterVente(vente: {
    date: string;
    plat: string;
    quantite: number;
    prix: number;
  }) {
    return addDoc(collection(this.db, 'ventes'), vente);
  }

  // Ajouter un achat
  async ajouterAchat(achat: {
    date: string;
    article: string;
    montant: number;
  }) {
    return addDoc(collection(this.db, 'achats'), achat);
  }

  // Lire toutes les ventes
  async lireVentes() {
    const resultat = await getDocs(collection(this.db, 'ventes'));
    return resultat.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  }

  // Lire tous les achats
  async lireAchats() {
    const resultat = await getDocs(collection(this.db, 'achats'));
    return resultat.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  }

  // Supprimer une vente grâce à son identifiant
  async supprimerVente(id: string) {
    return deleteDoc(doc(this.db, 'ventes', id));
  }

  // Supprimer un achat grâce à son identifiant
  async supprimerAchat(id: string) {
    return deleteDoc(doc(this.db, 'achats', id));
  }
}
