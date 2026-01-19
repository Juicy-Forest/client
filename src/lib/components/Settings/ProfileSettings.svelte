<script lang="ts">
  import ChangeButton from './ChangeButton.svelte';
  import SettingSection from './SettingSection.svelte';
  import { createFieldEnhancer } from '../../../routes/settings/settingHelpers';

  interface User {
    username: string;
    email: string;
  }

  interface FormState {
    username: { value: string; error: string; success: string };
    email: { value: string; error: string; success: string };
    password: { value: string; error: string; success: string };
  }

  const {
      user,
      formState,
      clearAllMessages
  } = $props<{
    user: User;
    formState: FormState;
    clearAllMessages: () => void;
  }>();
</script>

<div class="space-y-6">
  <SettingSection
    title="Change Username"
    action="?/updateUsername"
    fieldName="username"
    error={formState.username.error}
    success={formState.username.success}
    onEnhance={createFieldEnhancer({
        fieldName: 'username',
        formState,
        clearAllMessages,
        shouldReload: true,
        onSuccess: (data) => {
            user.username = data?.newUsername;
        }
    })}
  >
      <div class="space-y-4">
        <div>
          <label for="newUsername" class="block text-xs font-medium text-stone-600 mb-2">Current Username: {user.username}</label>
          <input
            id="newUsername"
            type="text"
            name="newUsername"
            bind:value={formState.username.value}
            class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
            placeholder="Enter new username"
          />
          <ChangeButton settingField="username" />
        </div>
      </div>
  </SettingSection>

  <SettingSection
    title="Change Email"
    action="?/updateEmail"
    fieldName="email"
    error={formState.email.error}
    success={formState.email.success}
    onEnhance={createFieldEnhancer({
        fieldName: 'email',
        formState,
        clearAllMessages,
        shouldReload: true,
        onSuccess: (data) => {
            user.email = data?.newEmail;
        }
    })}
  >
      <div class="space-y-4">
        <div>
          <label for="newEmail" class="block text-xs font-medium text-stone-600 mb-2">Current Email: {user.email}</label>
          <input
            id="newEmail"
            type="email"
            name="newEmail"
            bind:value={formState.email.value}
            class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
            placeholder="Enter new email"
          />
          <ChangeButton settingField="email" />
        </div>
      </div>
  </SettingSection>

  <SettingSection
    title="Change Password"
    action="?/changePassword"
    fieldName="password"
    error={formState.password.error}
    success={formState.password.success}
    onEnhance={createFieldEnhancer({
        fieldName: 'password',
        formState,
        clearAllMessages,
        shouldReload: false
    })}
  >
      <div class="space-y-4">
        <div>
          <label for="newPassword" class="block text-xs font-medium text-stone-600 mb-2">New Password</label>
          <input
            id="newPassword"
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            bind:value={formState.password.value}
            class="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
          <ChangeButton settingField="password" />
        </div>
      </div>
  </SettingSection>
</div>
