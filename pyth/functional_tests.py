from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.firefox.options import Options
import unittest
import time
from selenium.webdriver.common.keys import Keys
from selenium.webdriver import ActionChains

# NOTE: You may need to download geckodriver, if you are using linux and haven't already downloaded it


def wait_ten_seconds_for(some_function):
    def decorated_function(the_self, arg_one):
        max_wait = 10
        start_time = time.time()
        # print("Timer started")
        while True:
            try:
                return some_function(the_self, arg_one)
            except (AssertionError, WebDriverException) as e:
                if time.time() - start_time > max_wait:
                    # print("waiting for up to ten seconds")
                    raise e
                time.sleep(0.5)

    return decorated_function


class TestHomePage(unittest.TestCase):
    port = '8009'

    def setUp(self):
        options = Options()
        options.add_argument("--headless")  # Use a headless browser (one with no gui/window)
        self.browser = webdriver.Firefox(options=options,
                                         executable_path="../../geckodriver")
        try:
            self.browser.get('http://localhost:{}/'.format(self.port))
        except WebDriverException:
            print("Exception in setUp().  Have you remembered to start a webserver on port {}?".format(self.port))
            self.browser.quit()
            raise

    def tearDown(self):
        self.browser.quit()

    @wait_ten_seconds_for
    def check_for_href_and_download_in_element(self, element_id):
        download_button = self.browser.find_element_by_id(element_id)
        download_link = download_button.get_attribute('href')
        self.assertIsNotNone(download_link)

        download_filename = download_button.get_attribute('download')
        self.assertEqual(download_filename, 'HiFiDraw.png')

    @wait_ten_seconds_for
    def check_for_page_title(self, expected_title):
        self.assertEqual(self.browser.title, expected_title)

    def test_can_delete_example_rows_and_add_blank_row(self):
        # Edith wants to make a super simple diagram of her iPhone and active monitors.
        # Someone gives her a link to our site

        # She notices the page title and header
        self.assertIn('HiFiDraw', self.browser.title)

        page_header = self.browser.find_element_by_tag_name('h3').text
        self.assertIn('HiFi Draw', page_header)

        # She notices a table with some rows (or at least a row)
        delete_buttons = self.browser.find_elements_by_xpath("//tbody/tr/td/input[@value='-']")
        self.assertGreater(len(delete_buttons), 0)

        # She deletes the example rows...
        for delete_button in delete_buttons:
            delete_button.click()

        delete_buttons = self.browser.find_elements_by_xpath("//tbody/tr/td/input[@value='-']")
        self.assertEqual(len(delete_buttons), 0)

        # ...and adds a new blank row
        add_buttons = self.browser.find_elements_by_xpath("//thead/tr/th/input[@value='+']")
        self.assertEqual(len(add_buttons), 1)
        add_buttons[0].click()

        # She notices that the empty row appears to want input
        source_boxes = self.browser.find_elements_by_xpath("//tbody/tr/td/input[@placeholder='source']")
        dest_boxes = self.browser.find_elements_by_xpath("//tbody/tr/td/input[@placeholder='dest']")
        self.assertEqual(len(source_boxes), 1)
        self.assertEqual(len(dest_boxes), 1)

    def test_keyboard_shortcuts(self):
        # There should be at least one row in our table
        number_tbody_rows_start = len(self.browser.find_elements_by_xpath("//tbody/tr"))
        self.assertGreater(number_tbody_rows_start, 0)

        # The table row should have at least one text input
        all_table_text_inputs = self.browser.find_elements_by_xpath("//tbody/tr/td/input[@type='text']")
        self.assertGreater(len(all_table_text_inputs), 0, "Expected at least some rows to begin with.")

        # Find the last text input and send a RETURN keystroke
        last_table_text_input = all_table_text_inputs[-1]
        last_table_text_input.send_keys(Keys.RETURN)

        # We should now have one more row than we had to start with
        self.assertEqual(number_tbody_rows_start + 1,
                         len(self.browser.find_elements_by_xpath("//tbody/tr")))

        # If we send RETURN and SHIFT, it should delete a row regardless of which input we send it to
        ActionChains(self.browser).key_down(Keys.SHIFT).send_keys(Keys.RETURN).key_up(Keys.SHIFT).perform()

        self.assertEqual(number_tbody_rows_start,
                         len(self.browser.find_elements_by_xpath("//tbody/tr")))

    def test_can_download_png(self):
        self.check_for_href_and_download_in_element('id_download')

    def test_there_is_export_link(self):
        export_link = self.browser.find_element_by_id('id_export_link')
        current_url = self.browser.current_url

        self.assertTrue(current_url in export_link.text)

    def test_can_follow_examples_link(self):
        example_link_element = self.browser.find_element_by_id('id_examples_link')

        # User .get_attribute instead of .text because the element may be hidden in the nav bar collapsible
        example_link_text = example_link_element.get_attribute('textContent')
        self.assertEqual(example_link_text, 'Examples')

        example_link = example_link_element.get_attribute('href')
        self.browser.get(example_link)
        self.check_for_page_title('HiFiDraw Examples')

    def test_is_a_github_link(self):
        github_link_element = self.browser.find_element_by_id('id_github_link')

        # User .get_attribute instead of .text because the element may be hidden in the nav bar collapsible
        github_link_text = github_link_element.get_attribute('textContent')
        self.assertEqual(github_link_text, 'GitHub')

        github_link = github_link_element.get_attribute('href')
        self.assertTrue('github' in github_link)


class TestExamplesPage(unittest.TestCase):
    port = '8009'

    def setUp(self):
        options = Options()
        options.add_argument("--headless")  # Use a headless browser (one with no gui/window)
        self.browser = webdriver.Firefox(options=options,
                                         executable_path="../../geckodriver")
        try:
            self.browser.get('http://localhost:{}/examples.html'.format(self.port))
        except WebDriverException:
            print("Exception in setUp().  Have you remembered to start a webserver on port {}?".format(self.port))
            self.browser.quit()
            raise

    def tearDown(self):
        self.browser.quit()

    @wait_ten_seconds_for
    def check_for_href_and_download_in_element(self, element_id):
        download_button = self.browser.find_element_by_id(element_id)
        download_link = download_button.get_attribute('href')
        self.assertIsNotNone(download_link)

        download_filename = download_button.get_attribute('download')
        self.assertEqual(download_filename, 'HiFiDraw.png')

    @wait_ten_seconds_for
    def check_for_page_title(self, expected_title):
        self.assertEqual(self.browser.title, expected_title)

    def test_examples_page_export(self):
        # A visitor goes to our examples page and notices the heading
        self.check_for_page_title('HiFiDraw Examples')

        # They see that there are some examples
        canvases = self.browser.find_elements_by_tag_name("canvas")
        self.assertEqual(len(canvases), 3)

        # They see that there is a download link for each canvas
        self.browser.find_element_by_xpath("//div/a[@download='HiFiDraw Example1.png']")

        # They see that there is an export link for each canvas
        self.browser.find_element_by_xpath("//div/input[@value='Copy link']")


if __name__ == '__main__':
    unittest.main()
