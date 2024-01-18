import { avisService } from './avis.services';
import { AvisFrontViewType } from './avis.types';

const avisView: AvisFrontViewType = {
  name: 'docker',
  description: `<p>
        Après cette formation
        Vous pouvez nous contacter pour une de nos formations suivantes
        <ul>
          <li>Kubernetes</li>
          <li>Ansible</li>
          <li>Terraform</li>
        </ul>
    </p>`,
  title: `Maîtrisez Docker et gérez vos conteneurs efficacement`,
};

const populate = async () => {
  const avisViewBd = await avisService.readAvisFrontendViewBySlug('docker');
  console.log('avisViewBd', avisViewBd);
  if (!avisViewBd) await avisService.createAvisFrontendView(avisView);
  console.log('succes creating a mock view for the name "docker"');
};

export { populate };
