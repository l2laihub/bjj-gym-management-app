import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Calendar, Award, Activity, 
  AlertCircle, Edit, Phone, ArrowLeft 
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { useMembers } from '../hooks/useMembers';
import { getMemberDetails } from '../lib/members/queries';
import { getBeltColor } from '../utils/beltUtils';
import { EditMemberForm } from '../components/members/forms/EditMemberForm';
import { EmergencyContactForm } from '../components/members/forms/EmergencyContactForm';
import { MedicalInfoForm } from '../components/members/forms/MedicalInfoForm';
import { BeltPromotionForm } from '../components/members/forms/BeltPromotionForm';
import type { Member, MemberDetails } from '../types/member';

export default function MemberProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { members, refetch } = useMembers();
  const [member, setMember] = useState<Member | null>(null);
  const [details, setDetails] = useState<MemberDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEmergencyContactModal, setShowEmergencyContactModal] = useState(false);
  const [showMedicalInfoModal, setShowMedicalInfoModal] = useState(false);
  const [showBeltPromotionModal, setShowBeltPromotionModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const foundMember = members.find(m => m.id === id);
    if (foundMember) {
      setMember(foundMember);
      loadMemberDetails(foundMember.id);
    }
  }, [id, members]);

  const loadMemberDetails = async (memberId: string) => {
    try {
      setLoading(true);
      const data = await getMemberDetails(memberId);
      setDetails(data);
    } catch (error) {
      console.error('Error loading member details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSuccess = async () => {
    await refetch();
    await loadMemberDetails(id!);
  };

  if (!member) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">Member not found</h2>
          <p className="mt-2 text-gray-500">The member you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/members')}
            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Members
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/members')}
          className="mb-4 inline-flex items-center text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Members
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{member.fullName}</h1>
            <p className="text-gray-500 flex items-center mt-1">
              <Mail className="w-4 h-4 mr-2" />
              {member.email}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowBeltPromotionModal(true)}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <Award className="w-5 h-5 mr-2" />
              Promote
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
            >
              <Edit className="w-5 h-5 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Basic Information</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className={`w-6 h-6 ${getBeltColor(member.belt || 'white')} rounded-full mr-2`} />
                  <span className="capitalize">{member.belt || 'White'} Belt</span>
                  <div className="ml-2 flex space-x-1">
                    {[...Array(member.stripes || 0)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                  <span className="text-gray-600">
                    Member since {new Date(member.joinDate).toLocaleDateString()}
                  </span>
                </div>
                {member.birthday && (
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                    <span className="text-gray-600">
                      Birthday: {new Date(member.birthday).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {member.isMinor && member.parentName && (
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-gray-400" />
                    <span className="text-gray-600">
                      Parent/Guardian: {member.parentName}
                    </span>
                  </div>
                )}
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    member.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {member.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Belt History */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Belt History</h2>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : details?.beltHistory?.length ? (
                <div className="space-y-6">
                  {details.beltHistory.map((promotion, index) => (
                    <div key={index} className="flex items-start">
                      <Award className="w-5 h-5 text-indigo-600 mt-1" />
                      <div className="ml-4">
                        <p className="font-medium">
                          Promoted to {promotion.belt} Belt
                          {promotion.stripes > 0 && ` (${promotion.stripes} stripes)`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(promotion.promotedAt).toLocaleDateString()}
                        </p>
                        {promotion.notes && (
                          <p className="text-sm text-gray-600 mt-1">{promotion.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No belt history available</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Recent Activity</h2>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : details?.recentActivity?.length ? (
                <div className="space-y-4">
                  {details.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start">
                      <Activity className="w-5 h-5 text-green-600 mt-1" />
                      <div className="ml-4">
                        <p className="font-medium">{activity.type}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                        {activity.details && (
                          <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recent activity</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Emergency Contact</h2>
                <button 
                  onClick={() => setShowEmergencyContactModal(true)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  {details?.emergencyContact ? 'Edit' : 'Add'}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ) : details?.emergencyContact ? (
                <div className="space-y-3">
                  <p className="font-medium">{details.emergencyContact.name}</p>
                  <div className="flex items-center text-gray-500">
                    <Phone className="w-4 h-4 mr-2" />
                    {details.emergencyContact.phone}
                  </div>
                  <p className="text-gray-500">
                    Relationship: {details.emergencyContact.relationship}
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No emergency contact added</p>
                  <button 
                    onClick={() => setShowEmergencyContactModal(true)}
                    className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Add Contact
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Medical Information</h2>
                <button 
                  onClick={() => setShowMedicalInfoModal(true)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  {details?.medicalInfo ? 'Edit' : 'Add'}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ) : details?.medicalInfo ? (
                <div className="space-y-4">
                  {details.medicalInfo.conditions?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Medical Conditions:</h3>
                      <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                        {details.medicalInfo.conditions.map((condition, index) => (
                          <li key={index}>{condition}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {details.medicalInfo.allergies?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Allergies:</h3>
                      <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                        {details.medicalInfo.allergies.map((allergy, index) => (
                          <li key={index}>{allergy}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {details.medicalInfo.bloodType && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Blood Type:</h3>
                      <p className="text-sm text-gray-600">{details.medicalInfo.bloodType}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No medical information added</p>
                  <button 
                    onClick={() => setShowMedicalInfoModal(true)}
                    className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Add Medical Info
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Member"
      >
        <EditMemberForm
          member={member}
          onSuccess={() => {
            setShowEditModal(false);
            handleUpdateSuccess();
          }}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showEmergencyContactModal}
        onClose={() => setShowEmergencyContactModal(false)}
        title={details?.emergencyContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
      >
        <EmergencyContactForm
          memberId={member.id}
          initialData={details?.emergencyContact}
          onSuccess={() => {
            setShowEmergencyContactModal(false);
            loadMemberDetails(member.id);
          }}
          onCancel={() => setShowEmergencyContactModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showMedicalInfoModal}
        onClose={() => setShowMedicalInfoModal(false)}
        title={details?.medicalInfo ? 'Edit Medical Information' : 'Add Medical Information'}
      >
        <MedicalInfoForm
          memberId={member.id}
          initialData={details?.medicalInfo}
          onSuccess={() => {
            setShowMedicalInfoModal(false);
            loadMemberDetails(member.id);
          }}
          onCancel={() => setShowMedicalInfoModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showBeltPromotionModal}
        onClose={() => setShowBeltPromotionModal(false)}
        title="Belt Promotion"
      >
        <BeltPromotionForm
          member={member}
          onSubmit={async () => {
            await handleUpdateSuccess();
            setShowBeltPromotionModal(false);
          }}
          onCancel={() => setShowBeltPromotionModal(false)}
        />
      </Modal>
    </PageContainer>
  );
}