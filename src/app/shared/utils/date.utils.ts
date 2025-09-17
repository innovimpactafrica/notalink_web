export class DateUtils {
  /**
   * Formater une date selon le locale français
   */
  static formatDate(date: Date | string, format: 'short' | 'medium' | 'long' = 'medium'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const options: { [key: string]: Intl.DateTimeFormatOptions } = {
      short: { day: '2-digit', month: '2-digit', year: 'numeric' as const },
      medium: { day: '2-digit', month: 'long', year: 'numeric' as const },
      long: { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' as const }
    };

    return dateObj.toLocaleDateString('fr-FR', options);
  }

  /**
   * Formater l'heure
   */
  static formatTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Obtenir l'âge depuis une date de naissance
   */
  static calculateAge(birthDate: Date | string): number {
    const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Vérifier si une date est aujourd'hui
   */
  static isToday(date: Date | string): boolean {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    
    return dateObj.getDate() === today.getDate() &&
           dateObj.getMonth() === today.getMonth() &&
           dateObj.getFullYear() === today.getFullYear();
  }

  /**
   * Obtenir le temps relatif (il y a X minutes/heures/jours)
   */
  static getRelativeTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'À l\'instant';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `Il y a ${diffInMonths} mois`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `Il y a ${diffInYears} an${diffInYears > 1 ? 's' : ''}`;
  }
}